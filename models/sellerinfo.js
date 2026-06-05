import mongoose from "mongoose";

const sellerInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One user can only create one seller account
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
      default: "https://placehold.co",
    },
    banner: {
      type: String,
      default: "https://placehold.co",
    },
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: "Pakistan" },
    },
    phone: {
      type: String,
      required: true,
    },
    cnicOrTaxId: {
      type: String,
      required: [true, "CNIC or Tax ID is required for verification"],
      trim: true,
    },
    bankDetails: {
      accountTitle: { type: String, required: true },
      accountNumber: { type: String, required: true }, // or IBAN
      bankName: { type: String, required: true },
      branchCode: { type: String },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0, // Keeps track of how many people rated the seller
    },
  },
  { timestamps: true },
);

// --- INDEXING ---
sellerInfoSchema.index({ storeName: "text" }); // For searching stores by name
sellerInfoSchema.index({ isVerified: 1, isBanned: 1 }); // Multi-field index for rapid seller filtration

export default mongoose.models.SellerInfo ||
  mongoose.model("SellerInfo", sellerInfoSchema);
