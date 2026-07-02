import { connectDB } from "@/lib/connectdb";
import {
  getAuthUser,
  requireRole,
  unauthorized,
  forbidden,
} from "@/lib/api-auth";
import Category from "@/models/categories";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!requireRole(user, "admin")) return forbidden();

    const body = await req.json();
    await connectDB();
    const newCategory = await Category.create(body);
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create category" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const main = searchParams.get("main");
    const parentId = searchParams.get("parentId");
    const all = searchParams.get("all");

    // All categories (for admin panel tree view)
    if (all === "true") {
      const allCategories = await Category.find({})
        .sort({ level: 1, name: 1 })
        .lean();
      return NextResponse.json(allCategories);
    }

    if (slug) {
      const category = await Category.findOne({ slug }).lean();
      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(category);
    }

    // Main categories only (for sidebar + navbar)
    if (main === "true") {
      const rootCategories = await Category.find({ parentCategory: null })
        .hint({ parentCategory: 1 })
        .lean();
      return NextResponse.json(rootCategories);
    }

    // Sub categories of any parent
    const effectiveParentId = parentId || id;
    if (effectiveParentId) {
      const subCategories = await Category.find({
        parentCategory: effectiveParentId,
      })
        .hint({ parentCategory: 1 })
        .lean();
      return NextResponse.json(subCategories);
    }

    // Default: return root categories
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

export async function PUT(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!requireRole(user, "admin")) return forbidden();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const updated = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update category" },
      { status: 500 },
    );
  }
}

async function deleteCategoryWithDescendants(id) {
  const subs = await Category.find({ parentCategory: id });
  for (const sub of subs) {
    await deleteCategoryWithDescendants(sub._id);
  }
  await Category.findByIdAndDelete(id);
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

    await deleteCategoryWithDescendants(id);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete category" },
      { status: 500 },
    );
  }
}
