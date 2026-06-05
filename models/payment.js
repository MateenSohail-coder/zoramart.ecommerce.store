import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "EasyPaisa", "JazzCash", "COD"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    amountPaid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ user: 1 });

paymentSchema.index({ order: 1 });

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
