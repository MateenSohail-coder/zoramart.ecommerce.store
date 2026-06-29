import { connectDB } from "@/lib/connectdb";
import sellerInfo from "@/models/sellerinfo";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { getAuthUser, unauthorized, forbidden, requireRole } =
    await import("@/lib/api-auth");
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!requireRole(user, "seller", "admin")) return forbidden();

  const body = await req.json();
  await connectDB();

  try {
    // Create/replace the seller info for this user
    // (sellerInfo.user is unique)
    const existing = await sellerInfo.findOne({ user: user.id });

    if (existing) {
      const updated = await sellerInfo.findOneAndUpdate(
        { user: user.id },
        { $set: { ...body, user: user.id } },
        { new: true, runValidators: true },
      );

      return NextResponse.json({
        message: "sellerInfo updated successfully",
        newsellerInfo: updated,
      });
    }

    const newsellerInfo = await sellerInfo.create({
      ...body,
      user: user.id,
    });

    return NextResponse.json(
      {
        message: "sellerInfo successfully created",
        newsellerInfo,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Failed to create sellerinfo",
      },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  const { getAuthUser, unauthorized } = await import("@/lib/api-auth");
  const user = await getAuthUser();
  if (!user) return unauthorized();

  await connectDB();
  try {
    if (user.role === "admin") {
      const sellers = await sellerInfo.find({}).populate("user", "name email isBlocked").sort({ createdAt: -1 }).lean();
      return NextResponse.json(sellers);
    }

    const sellerInfoDoc = await sellerInfo.findOne({ user: user.id }).lean();
    return NextResponse.json(sellerInfoDoc);
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Failed to fetch seller info",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  // Not exposed for buyers; only allow seller to delete their own record.
  const { getAuthUser, unauthorized, forbidden, requireRole } =
    await import("@/lib/api-auth");
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!requireRole(user, "seller", "admin")) return forbidden();

  await connectDB();
  try {
    const params = new URL(req.url);
    const id = params.searchParams.get("id");

    if (id) {
      // Ensure the record belongs to the requester
      const doc = await sellerInfo.findById(id).lean();
      if (!doc || String(doc.user) !== String(user.id)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      await sellerInfo.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "sellerInfo deleted successfully" },
        { status: 200 },
      );
    }

    await sellerInfo.deleteOne({ user: user.id });
    return NextResponse.json(
      { message: "sellerInfo deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete sellerinfo", error: error?.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  const { getAuthUser, unauthorized, forbidden, requireRole } =
    await import("@/lib/api-auth");
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!requireRole(user, "seller", "admin")) return forbidden();

  try {
    await connectDB();
    const body = await req.json();

    const updateData = { ...body };
    delete updateData._id;
    delete updateData.user;

    const updated = await sellerInfo.findOneAndUpdate(
      { user: user.id },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { message: "sellerInfo not found for this user" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "sellerInfo updated successfully",
      sellerInfo: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error?.message },
      { status: 500 },
    );
  }
}

