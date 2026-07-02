import mongoose from "mongoose";
import { connectDB } from "@/lib/connectdb";
import {
  getAuthUser,
  requireRole,
  unauthorized,
  forbidden,
} from "@/lib/api-auth";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();
    if (!requireRole(user, "seller", "admin")) return forbidden();

    const body = await req.json();
    await connectDB();

    const newProduct = await Product.create({
      ...body,
      seller: body.seller || user.id,
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create product" },
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

    if (id || slug) {
      const filter = id ? { _id: id } : { slug };
      const product = await Product.findOne(filter)
        .populate("category", "name slug level")
        .populate("seller", "name email")
        .lean();

      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(product);
    }

    const categoryId = searchParams.get("categoryid");
    const sellerId = searchParams.get("sellerId");

    // Category semantics:
    // - If categoryId is a MAIN category -> include products from ALL subcategories under it.
    // - If categoryId is a SUB category -> include products only for that category.
    const { default: Category } = await import("@/models/categories");

    // Seller scoping: sellers can only see their own products.
    // Admin can see everything.
    const authUser = await getAuthUser();
    const isSeller = authUser?.role === "seller";
    const isAdmin = authUser?.role === "admin";

    const effectiveSellerId = isSeller ? authUser.id : sellerId;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const minPriceRaw = searchParams.get("minPrice");
    const maxPriceRaw = searchParams.get("maxPrice");
    const inStockRaw = searchParams.get("inStock");
    const search = searchParams.get("search");

    const filter = {};

    if (categoryId) {
      const catObjectId = new mongoose.Types.ObjectId(categoryId);

      const selectedCategory = await Category.findById(catObjectId)
        .select("level parentCategory")
        .lean();

      // Recursively collect ALL descendant category ObjectIds
      const collectDescendants = async (parentId) => {
        const children = await Category.find({ parentCategory: parentId })
          .select("_id")
          .lean();
        const ids = children.map((c) => c._id);
        for (const child of children) {
          const grandchildIds = await collectDescendants(child._id);
          ids.push(...grandchildIds);
        }
        return ids;
      };

      if (selectedCategory?.level === 1) {
        // main -> include products in this category AND all descendants
        const descendantIds = await collectDescendants(catObjectId);
        descendantIds.push(catObjectId);
        filter.category = { $in: descendantIds };
      } else {
        // sub -> include products in this category, all its descendants, AND its parent
        const catIds = [catObjectId];
        const descendantIds = await collectDescendants(catObjectId);
        catIds.push(...descendantIds);
        if (selectedCategory?.parentCategory) {
          catIds.push(selectedCategory.parentCategory);
        }
        filter.category = { $in: catIds };
      }
    }

    if (effectiveSellerId) filter.seller = effectiveSellerId;

    if (minPriceRaw || maxPriceRaw) {
      const priceFilter = {};
      if (minPriceRaw) priceFilter.$gte = Number(minPriceRaw);
      if (maxPriceRaw) priceFilter.$lte = Number(maxPriceRaw);
      filter.price = priceFilter;
    }

    if (
      inStockRaw !== null &&
      inStockRaw !== undefined &&
      searchParams.has("inStock")
    ) {
      const inStock = inStockRaw === "true";
      filter.stock = inStock ? { $gt: 0 } : { $lte: 0 };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const sortFieldMap = {
      createdAt: "createdAt",
      price: "price",
      rating: "rating",
      sold: "sold",
      stock: "stock",
      name: "name",
      relevance: "relevance",
    };

    const sortField =
      sortFieldMap[sort] || (search ? "relevance" : "createdAt");

    let query = Product.find(filter).populate("category", "name slug level");

    if (sortField === "relevance" && search) {
      query = query.sort({ score: { $meta: "textScore" } });
    } else {
      query = query.sort({ [sortField]: order });
    }

    const products = await query.skip(skip).limit(limit).lean();

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      products,
      hasMore: skip + products.length < total,
      total,
      page,
      limit,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (user.role !== "admin" && String(product.seller) !== String(user.id)) {
      return forbidden();
    }

    Object.assign(product, updateData);
    const updated = await product.save();

    const populated = await Product.findById(updated._id)
      .populate("category", "name slug level")
      .lean();

    return NextResponse.json(populated);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  return PUT(req);
}

export async function DELETE(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Id not found" }, { status: 404 });
    }

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (user.role !== "admin" && String(product.seller) !== String(user.id)) {
      return forbidden();
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete product" },
      { status: 500 },
    );
  }
}
