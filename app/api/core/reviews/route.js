import { connectDB } from "@/lib/connectdb";
import Review from "@/models/reviews";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  try {
    const payload = {
      ...body,
      product: body.product || body.productId,
      user: body.user || body.userId,
    };
    const newReview = await Review.create(payload);
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
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    // If seller is logged in and productId is not explicitly provided,
    // show only reviews for products owned by that seller.
    // Admin sees all.
    const { getAuthUser } = await import("@/lib/api-auth");
    const authUser = await getAuthUser();

    const baseFilter = productId ? { product: productId } : {};

    if (authUser?.role === "seller" && !productId) {
      // Find products owned by this seller and only return their reviews.
      const Product = (await import("@/models/product")).default;
      const sellerProducts = await Product.find({ seller: authUser.id })
        .select("_id")
        .lean();
      const productIds = sellerProducts.map((p) => p._id);
      baseFilter.product = { $in: productIds };
    }

    const reviews = await Review.find(baseFilter)
      .populate("user", "name image")
      .populate("product", "name slug images")
      .sort({ createdAt: -1 });

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
