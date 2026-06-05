import { connectDB } from "@/lib/connectdb";
import Payment from "@/models/payment";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  try {
    const newPayment = await Payment.create(body);
    return NextResponse.json(
      {
        message: "Payment successfully created",
        newPayment,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create payment",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  await connectDB();
  try {
    const payments = await Payment.find({});
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch payments",
      },
      { status: 500 },
    );
  }
}
export async function DELETE(req) {
  const params = new URL(req.url);
  const id = params.searchParams.get("id");
  await connectDB();
  try {
    if (!id) {
      return NextResponse.json({ message: "Id not found" }, { status: 404 });
    }
    await Payment.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Payment deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete payment" },
      { status: 500 },
    );
  }
}
export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Payment ID is required" },
        { status: 400 },
      );
    }

    const result = await Payment.updateOne(
      { _id: _id },
      { $set: updateData },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Payment updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
