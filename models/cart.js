import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false }, // Prevents Mongoose from creating a separate auto-generated _id for every item inside the array
);

const CartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer ID is required"],
      unique: true, // Guarantees a user can only have exactly ONE active cart
    },
    items: [CartItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
  },
);

// --- INDEXING STRATEGY ---

// 1. Single Field Index on Buyer
// This makes fetching the cart via `Cart.findOne({ buyer: userId })` lightning-fast.
// Since 'unique: true' is defined on 'buyer' above, MongoDB automatically creates this index.

// 2. Compound Multikey Index
// If your application checks if a specific product already exists in a specific user's cart
// (e.g., Cart.findOne({ buyer: userId, "items.product": productId })), this compound index optimizes it.
CartSchema.index({ buyer: 1, "items.product": 1 });

// 3. TTL (Time-To-Live) Index (Optional but highly recommended for guest/abandoned carts)
// If you want to automatically delete inactive carts after 30 days to save database space:
// CartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
