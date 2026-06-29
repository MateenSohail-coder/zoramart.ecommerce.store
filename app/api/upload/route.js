import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getAuthUser, unauthorized } from "@/lib/api-auth";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ message: "No files provided" }, { status: 400 });
    }

    const urls = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadToCloudinary(buffer, "zoramart");
      urls.push(result.secure_url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
