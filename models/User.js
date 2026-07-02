import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/e9wwztga/image/upload/v1782984835/zoramart/lv5yiqsqnix9vrtrj8pm.jpg",
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    googleId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        street: String,
        city: String,
        country: String,
        isDefault: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.User || mongoose.model("User", userSchema);
