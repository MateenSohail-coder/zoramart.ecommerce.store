import { connectDB } from "@/lib/connectdb";
import {
  getAuthUser,
  requireRole,
  unauthorized,
  forbidden,
} from "@/lib/api-auth";
import { calcCartTotals } from "@/lib/cart-utils";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Payment from "@/models/payment";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");
    const status = searchParams.get("status");

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const filter = {};

    if (user.role === "buyer") {
      filter.buyer = user.id;
    } else if (user.role === "seller") {
      const sellerProducts = await Product.find({ seller: user.id }).select("_id").lean();
      const productIds = sellerProducts.map((p) => p._id);
      filter["items.product"] = { $in: productIds };
    } else if (buyerId && user.role === "admin") {
      filter.buyer = buyerId;
    }

    if (status) filter.orderStatus = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("buyer", "name email")
        .populate("paymentInfo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      hasMore: skip + orders.length < total,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const body = await req.json();

    if (body.checkout) {
      return handleCheckout(user, body);
    }

    await connectDB();
    const newOrder = await Order.create({ ...body, buyer: body.buyer || user.id });

    return NextResponse.json({
      message: "Order successfully created",
      newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}

async function handleCheckout(user, body) {
  const {
    shippingAddress,
    billingAddress,
    paymentMethod = "COD",
    couponCode,
  } = body;

  if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) {
    return NextResponse.json(
      { message: "Complete shipping address is required" },
      { status: 400 },
    );
  }

  await connectDB();

  const cart = await Cart.findOne({ buyer: user.id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  let discount = 0;
  if (couponCode) {
    const code = String(couponCode).toUpperCase();
    if (code === "SAVE10") discount = calcCartTotals(cart.items).subtotal * 0.1;
    if (code === "FLAT50") discount = 50;
  }

  for (const item of cart.items) {
    const product = item.product;
    if (!product) {
      return NextResponse.json({ message: "Product no longer available" }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { message: `Insufficient stock for ${item.name}` },
        { status: 400 },
      );
    }
  }

  const totals = calcCartTotals(cart.items, discount);
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const payment = await Payment.create({
    user: user.id,
    transactionId,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
    amountPaid: totals.total,
  });

  const order = await Order.create({
    buyer: user.id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentInfo: payment._id,
    orderStatus: "Processing",
    totalAmount: totals.total,
    discount,
    couponCode: couponCode || null,
  });

  await Payment.findByIdAndUpdate(payment._id, { order: order._id });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  const populatedOrder = await Order.findById(order._id)
    .populate("paymentInfo")
    .populate("buyer", "name email")
    .lean();

  return NextResponse.json({
    message: "Order placed successfully",
    order: populatedOrder,
    payment,
  });
}

export async function PATCH(req) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const { _id, id, ...updateData } = body;
    const orderId = _id || id;

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (user.role === "buyer" && String(order.buyer) !== String(user.id)) {
      return forbidden();
    }

    if (user.role === "seller" && updateData.orderStatus) {
      const sellerProducts = await Product.find({ seller: user.id }).select("_id").lean();
      const productIds = sellerProducts.map((p) => String(p._id));
      const hasSellerItem = order.items.some((item) =>
        productIds.includes(String(item.product)),
      );
      if (!hasSellerItem) return forbidden();
    }

    if (user.role === "buyer" && updateData.orderStatus && updateData.orderStatus !== "Cancelled") {
      return forbidden();
    }

    const updated = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("buyer", "name email")
      .populate("paymentInfo");

    return NextResponse.json({
      message: "Order updated successfully",
      order: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
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
    await Order.findByIdAndDelete(id);

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete order" },
      { status: 500 },
    );
  }
}
