import { connectDB } from "@/lib/connectdb";
import { getAuthUser, unauthorized } from "@/lib/api-auth";
import { calcCartTotals, enrichCartItems } from "@/lib/cart-utils";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { NextResponse } from "next/server";

async function getOrCreateCart(buyerId) {
  let cart = await Cart.findOne({ buyer: buyerId });
  if (!cart) {
    cart = await Cart.create({ buyer: buyerId, items: [], totalAmount: 0 });
  }
  return cart;
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    await connectDB();

    const cart = await Cart.findOne({ buyer: user.id })
      .populate("items.product", "name slug price images stock downprice")
      .lean();

    if (!cart) {
      return NextResponse.json({
        _id: null,
        buyer: user.id,
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        totalAmount: 0,
        total: 0,
      });
    }

    return NextResponse.json(enrichCartItems(cart));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch cart", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { productId, quantity = 1 } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "productId is required" }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    if ((product.stock ?? 0) < quantity) {
      return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
    }

    const cart = await getOrCreateCart(user.id);
    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId),
    );

    if (existingIndex >= 0) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = product.price;
      cart.items[existingIndex].name = product.name;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        quantity,
        price: product.price,
      });
    }

    cart.totalAmount = calcCartTotals(cart.items).total;
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate("items.product", "name slug price images stock downprice")
      .lean();

    return NextResponse.json({
      message: "Item added to cart",
      cart: enrichCartItems(populated),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add to cart", error: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { productId, quantity } = await req.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: "productId and quantity are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const cart = await Cart.findOne({ buyer: user.id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.product) === String(productId),
    );
    if (itemIndex < 0) {
      return NextResponse.json({ message: "Item not in cart" }, { status: 404 });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId).lean();
      if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
      }
      if (quantity > product.stock) {
        return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
      }
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price;
    }

    cart.totalAmount = calcCartTotals(cart.items).total;
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate("items.product", "name slug price images stock downprice")
      .lean();

    return NextResponse.json({
      message: "Cart updated",
      cart: enrichCartItems(populated),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update cart", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const clear = searchParams.get("clear");

    await connectDB();

    const cart = await Cart.findOne({ buyer: user.id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    if (clear === "true") {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
      const emptyCart = await Cart.findById(cart._id)
        .populate("items.product", "name slug price images stock downprice")
        .lean();
      return NextResponse.json(enrichCartItems(emptyCart));
    }

    if (!productId) {
      return NextResponse.json({ message: "productId is required" }, { status: 400 });
    }

    cart.items = cart.items.filter(
      (item) => String(item.product) !== String(productId),
    );
    cart.totalAmount = calcCartTotals(cart.items).total;
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate("items.product", "name slug price images stock downprice")
      .lean();

    return NextResponse.json(enrichCartItems(populated));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete cart item", error: error.message },
      { status: 500 },
    );
  }
}
