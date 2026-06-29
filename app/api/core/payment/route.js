import { connectDB } from "@/lib/connectdb";
import { getAuthUser, requireRole, unauthorized, forbidden } from "@/lib/api-auth";
import Payment from "@/models/payment";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const body = await req.json();
    await connectDB();

    const newPayment = await Payment.create({
      ...body,
      user: body.user || user.id,
    });

    return NextResponse.json({
      message: "Payment successfully created",
      newPayment,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create payment" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    await connectDB();

    const filter = user.role === "admin" ? {} : { user: user.id };

    const payments = await Payment.find(filter)
      .populate("order")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!requireRole(user, "admin")) return forbidden();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Id not found" }, { status: 404 });
    }

    await connectDB();
    await Payment.findByIdAndDelete(id);

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete payment" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const { _id, id, ...updateData } = body;
    const paymentId = _id || id;

    if (!paymentId) {
      return NextResponse.json({ message: "Payment ID is required" }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    if (user.role !== "admin" && String(payment.user) !== String(user.id)) {
      return forbidden();
    }

    const updated = await Payment.findByIdAndUpdate(paymentId, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Payment updated successfully",
      payment: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
