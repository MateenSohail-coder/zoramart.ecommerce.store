import { connectDB } from "@/lib/connectdb";
import Category from "@/models/categories";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  await connectDB();
  const newCategory = await Category.create(body);
  return NextResponse.json(newCategory);
}
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // If an ID is provided, fetch all immediate child subcategories
    if (id) {
      const subCategories = await Category.find({ parentCategory: id })
        .hint({ parentCategory: 1 }) // Forces execution via indexed path
        .lean();

      return NextResponse.json(subCategories);
    }

    // Default: Fetch top-level root categories (where parentCategory is null)
    const rootCategories = await Category.find({ parentCategory: null })
      .hint({ parentCategory: 1 })
      .lean();

    return NextResponse.json(rootCategories);
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Something went wrong on the server" },
      { status: 500 },
    );
  }
}
