import { connectDB } from "@/lib/connectdb";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  try {
    const newCart = await Cart.create(body);
    return NextResponse.json(
      {
        message: "Cart successfully created",
        newCart,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create cart",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  await connectDB();
  try {
    const carts = await Cart.find({});
    return NextResponse.json(carts);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch carts",
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
    await Cart.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Cart deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete cart" },
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
        { message: "Cart ID is required" },
        { status: 400 },
      );
    }

    const result = await Cart.updateOne(
      { _id: _id },
      { $set: updateData },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Cart updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
