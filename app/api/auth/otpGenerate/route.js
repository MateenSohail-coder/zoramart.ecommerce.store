import { getOtpNumber } from "@/lib/bcrypt";
import { connectDB } from "@/lib/connectdb";
import Otp from "@/models/otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});
export async function POST(req) {
  try {
    const { userId } = await req.json();
    await connectDB();
    const otpKey = getOtpNumber();
    const existing = await Otp.findOne({ userId: userId });
    if (existing) {
      await Otp.deleteOne({ userId: userId });
    }
    const newOtp = await Otp.create({ userId: userId, otpKey: otpKey });
    const user = await User.findById(userId);
    //     const info = await transporter.sendMail({
    //       from: `"Your App Name" <${process.env.SMTP_EMAIL}>`,
    //       to: user.email,
    //       subject: `HI ${user.name} , here is your OTP`,
    //       html: `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    // <meta charset="utf-8">
    // <meta http-equiv="x-ua-compatible" content="ie=edge">
    // <meta name="viewport" content="width=device-width, initial-scale=1.0">
    // <title>Confirm your account</title>
    // <style type="text/css">
    // /* Keep a minimal embedded stylesheet — most important styles are inlined below for email clients */
    // @media (max-width:480px){
    // .hm { display:none !important; }
    // .t48 { padding:40px !important; border-radius:0 !important; }
    // .t37 { text-align:left !important; }
    // .t36 { vertical-align:top !important; width:auto !important; max-width:100% !important; }
    // .t24 { text-align:center !important; }
    // .t23 { vertical-align:middle !important; width:458px !important; }
    // }
    // </style>
    // </head>
    // <body style="Margin:0;padding:0;min-width:100%;background-color:#FFFFFF;font-family:Open Sans,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
    // <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:separate;table-layout:fixed;">
    // <tr>
    // <td align="center" style="padding:20px 10px;">
    // <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;border:1px solid #EBEBEB;background-color:#FFFFFF;border-radius:3px;padding:44px 42px 32px 42px;">
    // <tr>
    // <td align="left" style="padding-bottom:18px;">
    // <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
    // <tr>
    // <td width="135" style="width:135px;">
    // <a href="https://localhost:3000" target="_blank" style="text-decoration:none;">
    // <img src="https://687890cd-68b7-4fda-b85a-d730fb79c0ef.b-cdn.net/e/5fdc5837-db64-4ef4-b310-01d7651d9dca/1c3fd964-3fa2-404a-8b8d-31ad614ad637.png" alt="" width="135" height="135" style="display:block;border:0;height:auto;width:100%;max-width:135px;">
    // </a>
    // </td>
    // </tr>
    // </table>
    // </td>
    // </tr>

    // <tr>
    // <td style="border-bottom:1px solid #EFF1F4;padding:18px 0 18px 0;">
    // <h1 style="margin:0;font-family:Montserrat,Arial,sans-serif;font-size:24px;line-height:28px;font-weight:700;color:#3D4E56;text-align:left;">Confirm your account</h1>
    // </td>
    // </tr>

    // <tr><td style="height:18px;font-size:1px;line-height:18px;">&nbsp;</td></tr>

    // <tr>
    // <td style="text-align:left;">
    // <p style="margin:0;font-family:Open Sans,Arial,sans-serif;font-size:15px;line-height:25px;color:#3D4E56;">Here is your one-time Password OTP :</p>
    // </td>
    // </tr>

    // <tr><td style="height:21px;font-size:1px;line-height:21px;">&nbsp;</td></tr>

    // <tr>
    // <td align="center">
    // <table role="presentation" width="254" cellpadding="0" cellspacing="0" border="0" style="width:254px;max-width:254px;">
    // <tr>
    // <td style="background-color:#3D4E56;border-radius:10px;padding:0;overflow:hidden;">
    // <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    // <tr>
    // <td style="padding:15px 8px;text-align:center;">
    // <h1 style="margin:0;font-family:Poppins,Arial,sans-serif;font-size:32px;line-height:34px;font-weight:500;color:#F37E25;text-align:center;">${otpKey}</h1>
    // </td>
    // </tr>
    // </table>
    // </td>
    // </tr>
    // </table>
    // </td>
    // </tr>

    // <tr><td style="height:24px;font-size:1px;line-height:24px;">&nbsp;</td></tr>

    // <tr>
    // <td style="border-top:1px solid #DED9D9;padding-top:7px;text-align:center;">
    // <span style="display:block;font-family:Open Sans,Arial,sans-serif;font-size:14px;font-weight:500;color:#5B6F78;line-height:20px;">OTP is valid for only 5 minutes</span>
    // </td>
    // </tr>

    // </table>
    // </td>
    // </tr>
    // </table>
    // </body>
    // </html>`,
    //     });

    return NextResponse.json(
      { message: "otp generated successfully", newOtp },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to generate OTP" },
      { status: 500 },
    );
  }
}
