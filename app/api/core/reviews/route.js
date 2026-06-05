import { connectDB } from "@/lib/connectdb";
import Review from "@/models/reviews";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  try {
    const newReview = await Review.create(body);
    return NextResponse.json(
      {
        message: "Review successfully created",
        newReview,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create review",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  await connectDB();
  try {
    const reviews = await Review.find({});
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch reviews",
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
    await Review.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete review" },
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
        { message: "Review ID is required" },
        { status: 400 },
      );
    }

    const result = await Review.updateOne(
      { _id: _id },
      { $set: updateData },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Review updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
