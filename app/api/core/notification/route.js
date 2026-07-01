import { connectDB } from "@/lib/connectdb";
import { getAuthUser, unauthorized } from "@/lib/api-auth";
import Notification from "@/models/notification";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  await connectDB();

  try {
    const newNotification = await Notification.create(body);
    return NextResponse.json(
      {
        message: "Notification successfully created",
        newNotification,
      },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Failed to create notification",
      },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const read = searchParams.get("read");

    const filter = {};
    if (userId) filter.userId = userId;
    if (role) filter.role = role;
    if (read !== null) filter.read = read === "true";

    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });
    return NextResponse.json(notifications);
  } catch (e) {
    return NextResponse.json(
      {
        message: "Failed to fetch notifications",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const params = new URL(req.url);
  const id = params.searchParams.get("id");
  await connectDB();

  try {
    if (!id) {
      return NextResponse.json({ message: "Id not found" }, { status: 404 });
    }

    await Notification.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to delete notification" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Notification ID is required" },
        { status: 400 },
      );
    }

    const result = await Notification.updateOne(
      { _id },
      { $set: updateData },
      { runValidators: true },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Notification updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
