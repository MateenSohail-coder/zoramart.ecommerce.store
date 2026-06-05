import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

reviewsSchema.index({ product: 1, user: 1 }, { unique: true });

reviewsSchema.index({ product: 1, createdAt: -1 });

export default mongoose.models.Review ||
  mongoose.model("Review", reviewsSchema);
