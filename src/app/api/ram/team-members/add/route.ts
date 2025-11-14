import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/marathonAuth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify current user is a store owner
    const currentUser = await prisma.user_Z.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser || (currentUser.userType !== 'STORE_OWNER' && currentUser.userType !== 'VEC_STORE_OWNER')) {
      return NextResponse.json({ error: 'Only store owners can add team members' }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();
    const { phone, name, captainId } = body || {};

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Normalize phone (remove spaces, dashes, etc.)
    const normalizedPhone = phone.replace(/\D/g, '');

    // Check if user with this phone already exists
    const existingUser = await prisma.user_Z.findFirst({
      where: {
        phone: normalizedPhone
      }
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        isNew: false,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          phone: existingUser.phone,
          email: existingUser.email,
          userType: existingUser.userType,
          storeType: existingUser.storeType
        },
        message: 'User already exists with this phone number'
      });
    }

    // Create new partial user (without email and password - to be filled during registration)
    const newUser = await prisma.user_Z.create({
      data: {
        phone: normalizedPhone,
        name: name,
        email: null, // Will be provided during registration
        password_hash: null, // Will be provided during registration
        userType: 'DISTRIBUTOR', // Partial users start as DISTRIBUTOR
        storeType: currentUser.storeType, // Inherit store type from current user (DO NOT CHANGE during registration)
        captainId: captainId || null,
        isFirstLogin: true
      }
    });

    return NextResponse.json({
      success: true,
      isNew: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        userType: newUser.userType,
        storeType: newUser.storeType
      },
      message: 'New team member created successfully'
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
