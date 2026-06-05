import { connectDB } from "@/lib/connectdb";
import sellerInfo from "@/models/sellerinfo";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  try {
    const newsellerInfo = await sellerInfo.create(body);
    return NextResponse.json(
      {
        message: "sellerInfo successfully created",
        newsellerInfo,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create sellerinfo",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  await connectDB();
  try {
    const sellerinfos = await sellerInfo.find({});
    return NextResponse.json(sellerinfos);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch sellerinfos",
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
    await sellerInfo.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "sellerInfo deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete sellerinfo" },
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
        { message: "sellerInfo ID is required" },
        { status: 400 },
      );
    }

    const result = await sellerInfo.updateOne(
      { _id: _id },
      { $set: updateData },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "sellerInfo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "sellerInfo updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
