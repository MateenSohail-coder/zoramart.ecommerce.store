import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  otpKey: {
    type: Number,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
