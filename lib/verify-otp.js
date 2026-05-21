"use server";

import otp from "@/models/otp";

export async function verifyOtp(userId, enteredOtp) {
  const existing = await otp.findOne({ userId });

  if (!existing) return { ok: false, message: "No OTP found" };

  const elapsed = Date.now() - new Date(existing.createdAt).getTime();
  if (elapsed > 300000) return { ok: false, message: "OTP expired" };

  if (String(existing.otpKey) !== String(enteredOtp)) {
    return { ok: false, message: "Invalid OTP" };
  }

  return { ok: true, message: "OTP verified" };
}
