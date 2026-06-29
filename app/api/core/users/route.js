import { connectDB } from "@/lib/connectdb";
import { getAuthUser, requireRole, unauthorized, forbidden } from "@/lib/api-auth";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!requireRole(user, "admin")) return forbidden();

    await connectDB();

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorized();

    const body = await req.json();
    const { id, ...updateData } = body;
    const targetId = id || authUser.id;

    if (!targetId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    if (authUser.role !== "admin" && String(targetId) !== String(authUser.id)) {
      return forbidden();
    }

    if (authUser.role !== "admin" && updateData.role) {
      delete updateData.role;
    }

    if (updateData.password) {
      delete updateData.password;
    }

    await connectDB();

    const updated = await User.findByIdAndUpdate(targetId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update user" },
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
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete user" },
      { status: 500 },
    );
  }
}
