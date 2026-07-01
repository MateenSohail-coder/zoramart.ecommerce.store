import { connectDB } from "@/lib/connectdb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email } = await req.json();
  try {
    await connectDB();
    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
