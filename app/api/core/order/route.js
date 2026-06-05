import { connectDB } from "@/lib/connectdb";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  try {
    const newOrder = await Order.create(body);
    return NextResponse.json(
      {
        message: "Order successfully created",
        newOrder,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create order",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  await connectDB();
  try {
    const orders = await Order.find({});
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch orders",
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
    await Order.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete order" },
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
        { message: "Order ID is required" },
        { status: 400 },
      );
    }

    const result = await Order.updateOne(
      { _id: _id },
      { $set: updateData },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
