import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
  const { email, password, name, phone, userType, storeType, captainId, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = body || {};
  // require minimal fields
  if (!email || !password || !name || !userType) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // allowed user types
  const ALLOWED = ['VEC_STORE_OWNER', 'STORE_OWNER', 'CAPTAIN', 'DISTRIBUTOR'];
  if (!ALLOWED.includes(userType)) return NextResponse.json({ error: 'invalid_userType' }, { status: 400 });

  // simple server-side password policy check (mirror client)
  const pwValid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  if (!pwValid) return NextResponse.json({ error: 'weak_password', message: 'Password must be 8+ chars, include upper and lower case letters and a number' }, { status: 400 });

  // security questions validation
  if (!securityQuestion1 || !securityQuestion2 || !securityAnswer1 || !securityAnswer2) return NextResponse.json({ error: 'missing_security_questions' }, { status: 400 });
  if (securityQuestion1 === securityQuestion2) return NextResponse.json({ error: 'duplicate_security_questions' }, { status: 400 });

  // enforce storeType for certain user types
  if (userType === 'STORE_OWNER' && storeType && storeType !== 'NORMAL') return NextResponse.json({ error: 'invalid_storeType_for_store_owner' }, { status: 400 });
  if (userType === 'VEC_STORE_OWNER' && storeType && storeType !== 'VEC') return NextResponse.json({ error: 'invalid_storeType_for_vec_owner' }, { status: 400 });

  // if distributor ensure captain exists (server-side check)
  if (userType === 'DISTRIBUTOR') {
    if (!captainId) return NextResponse.json({ error: 'captain_required' }, { status: 400 });
    const cap: any[] = await prisma.$queryRaw`SELECT id FROM "User_Z" WHERE id = ${captainId} LIMIT 1`;
    if (!cap[0]) return NextResponse.json({ error: 'invalid_captain' }, { status: 400 });
  }

    // check if email already exists
    const existsByEmail: any[] = await prisma.$queryRaw`SELECT id FROM "User_Z" WHERE email = ${email} LIMIT 1`;
    if (existsByEmail[0]) return NextResponse.json({ error: 'already_registered' }, { status: 409 });

    // if distributor ensure captain exists
    if (userType === 'DISTRIBUTOR' && !captainId) return NextResponse.json({ error: 'captain_required' }, { status: 400 });

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // check if phone already exists (partial user created by store owner)
    let existingPartialUser: any = null;
    if (phone) {
      const normalizedPhone = phone.replace(/\D/g, '');
      const partialUsers: any[] = await prisma.$queryRaw`SELECT * FROM "User_Z" WHERE phone = ${normalizedPhone} LIMIT 1`;
      existingPartialUser = partialUsers[0];
    }

    // If partial user exists, update their record (complete registration)
    if (existingPartialUser) {
      // Update partial user with email, password, and security questions
      // BUT preserve their storeType (set by store owner when creating partial user)
      await prisma.user_Z.update({
        where: { id: existingPartialUser.id },
        data: {
          email: email,
          password_hash: hash,
          name: name || existingPartialUser.name, // use provided name or keep existing
          userType: userType || existingPartialUser.userType, // use provided userType or keep existing
          // DO NOT change storeType - keep the one set by store owner
          securityQuestion1: securityQuestion1 || null,
          securityAnswer1: securityAnswer1 || null,
          securityQuestion2: securityQuestion2 || null,
          securityAnswer2: securityAnswer2 || null,
          isFirstLogin: false, // mark as no longer first login
        },
      });

      return NextResponse.json({ success: true, message: 'Partial user completed successfully' });
    }

    // Create new user. If registering a CAPTAIN, also create a Captain_Z entry
    // and set the user's captainId to the captain record id (we use the same id
    // so the captain record maps to the user). Do this in a transaction.
    if (userType === 'CAPTAIN') {
      // transaction: create user -> create captain with the same id -> update user.captainId
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user_Z.create({
          data: {
            email: email,
            password_hash: hash,
            name: name,
            phone: phone,
            userType: userType,
            storeType: storeType || null,
            captainId: null,
            securityQuestion1: securityQuestion1 || null,
            securityAnswer1: securityAnswer1 || null,
            securityQuestion2: securityQuestion2 || null,
            securityAnswer2: securityAnswer2 || null,
          },
        });

        // create Captain_Z with same id as user so relations are straightforward
        await tx.captain_Z.create({
          data: {
            id: newUser.id,
            name: name,
          },
        });

        // update user to point to captain record
        await tx.user_Z.update({
          where: { id: newUser.id },
          data: { captainId: newUser.id },
        });
      });

      return NextResponse.json({ success: true });
    }

    // non-captain users: simple create
    await prisma.user_Z.create({
      data: {
        email: email,
        password_hash: hash,
        name: name,
        phone: phone,
        userType: userType,
        storeType: storeType || null,
        captainId: captainId || null,
        securityQuestion1: securityQuestion1 || null,
        securityAnswer1: securityAnswer1 || null,
        securityQuestion2: securityQuestion2 || null,
        securityAnswer2: securityAnswer2 || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
