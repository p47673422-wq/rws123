import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, PaymentStatus_Z } from "@prisma/client";
import { verifyToken } from "@/lib/marathonAuth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('marathon_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get current user
    const user = await prisma.user_Z.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!['VEC_STORE_OWNER', 'STORE_OWNER'].includes(user.userType)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { paymentId, status, rejectionReason } = body;

    if (!paymentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status === 'REJECTED' && !rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Begin transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update PaymentRequest_Z
      const paymentRequest = await tx.paymentRequest_Z.update({
        where: { id: paymentId },
        data: {
          status: status as PaymentStatus_Z,
          ...(rejectionReason && { rejectionReason }),
          verifiedById: user.id,
          verifiedAt: new Date(),
        },
      });

      // If verifying or rejecting, update the associated Payment_Z record
      if (paymentRequest.paymentId) {
        await tx.payment_Z.update({
          where: {
            id: paymentRequest.paymentId
          },
          data: {
            status: status as PaymentStatus_Z,
            ...(status === 'VERIFIED' ? {
              verifiedById: user.id,
              verifiedAt: new Date(),
            } : {
              verifiedById: null,
              verifiedAt: null,
            })
          },
        });
      } 
    //   else {
    //     // If there's no payment record yet, create one
    //     const payment = await tx.payment_Z.create({
    //       data: {
    //         distributorId: paymentRequest.distributorId,
    //         amount: paymentRequest.totalAmount,
    //         items: paymentRequest.items,
    //         status: status as PaymentStatus_Z,
    //         ...(status === 'VERIFIED' ? {
    //           verifiedById: user.id,
    //           verifiedAt: new Date(),
    //         } : {}),
    //         paymentRequest: {
    //           connect: {
    //             id: paymentRequest.id
    //           }
    //         }
    //       }
    //     });
        
    //     // Update the payment request with the new payment id
    //     await tx.paymentRequest_Z.update({
    //       where: { id: paymentRequest.id },
    //       data: {
    //         paymentId: payment.id
    //       }
    //     });
    //   }

      return paymentRequest;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in verify-status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}