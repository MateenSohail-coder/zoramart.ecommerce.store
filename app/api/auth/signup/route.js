import { connectDB } from "@/lib/connectdb";
import { hashPassword } from "@/lib/bcrypt";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, password, role } = await req.json();
  try {
    await connectDB();
    const existing = await User.findOne({ email: email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 401 },
      );
    }
    const hashP = await hashPassword(password);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashP,
      role: role,
      isVerfied: false,
      isBlocked: false,
    });
    return NextResponse.json(
      { message: "User created Sucessfully", newUser },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
export async function PUT(req) {
  const body = await req.json();

  try {
    await connectDB();
    const params = new URL(req.url);
    const userId = params.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "UserId is required" },
        { status: 404 },
      );
    }
    const updateUser = await User.findByIdAndUpdate(userId, body, {
      runValidators: true,
    });
    return NextResponse.json(
      { message: "status updated successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
