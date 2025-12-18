import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/bookingModel.js";
import nodemailer from "nodemailer";

const paymentRouter = express.Router();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn(
    "⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set in environment variables."
  );
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

const mailer =
  SMTP_USER && SMTP_PASS && SENDER_EMAIL
    ? nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : null;

const sendBookingConfirmationEmail = async (booking) => {
  if (!booking || !mailer) return;

  const paymentLine =
    booking.paymentOption === "partial"
      ? `30% advance paid (₹${booking.advanceAmount || 0}), remaining ₹${
          booking.remainingAmount || 0
        } at tour start`
      : booking.paymentOption === "full"
      ? `Full payment received (₹${
          booking.totalAmount || booking.advanceAmount || 0
        })`
      : "Payment to be collected offline";

  const subject = `Booking Confirmed ✅ | ${booking.tourName} – LadakhTrails`;

  try {
    // Customer email
    await mailer.sendMail({
      from: `LadakhTrails <${SENDER_EMAIL}>`,
      to: booking.email,
      subject,
      html: customerEmailTemplate(booking, paymentLine),
    });

    // Admin email
    await mailer.sendMail({
      from: `LadakhTrails <${SENDER_EMAIL}>`,
      to: SENDER_EMAIL,
      subject: `ADMIN – ${subject}`,
      html: adminEmailTemplate(booking, paymentLine),
    });
  } catch (error) {
    console.error("Email send failed:", error);
  }
};

// Create Razorpay order for a booking
paymentRouter.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.json({
        success: false,
        message: "amount and bookingId are required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // convert to paise
      currency,
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId,
        tourName: booking.tourName,
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      order,
      keyId: razorpayKeyId,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
});

// Verify Razorpay payment and mark booking as confirmed
paymentRouter.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingId
    ) {
      return res.json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const hmac = crypto.createHmac("sha256", razorpayKeySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.json({ success: false, message: "Invalid payment signature" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // send email notifications on confirmed payment
    sendBookingConfirmationEmail(updatedBooking);

    return res.json({
      success: true,
      message: "Payment verified and booking confirmed",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return res.json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
});

export default paymentRouter;


// ================= EMAIL TEMPLATES =================

const customerEmailTemplate = (booking, paymentLine) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { background:#f4f6f8; font-family: Arial, Helvetica, sans-serif; }
    .container {
      max-width:620px; margin:30px auto; background:#fff;
      border-radius:10px; overflow:hidden;
      box-shadow:0 6px 18px rgba(0,0,0,.08);
    }
    .header {
      background:#0f766e; color:#fff; padding:22px; text-align:center;
    }
    .content { padding:26px; color:#333; }
    h2 { font-size:14px; color:#0f766e; border-bottom:1px solid #e5e7eb; }
    table { width:100%; font-size:14px; }
    td { padding:6px 0; }
    td:first-child { color:#6b7280; width:40%; }
    .badge {
      background:#dcfce7; color:#166534;
      padding:6px 14px; border-radius:999px; font-weight:bold;
      display:inline-block;
    }
    .footer { background:#f9fafb; padding:16px; text-align:center; font-size:12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed ✅</h1>
      <p>LadakhTrails</p>
    </div>

    <div class="content">
      <p>Jullay <strong>${booking.fullName}</strong>,</p>

      <h2>Tour Details</h2>
      <table>
        <tr><td>Tour</td><td>${booking.tourName}</td></tr>
        <tr><td>Dates</td><td>${booking.startDate || "—"} to ${booking.endDate || "—"}</td></tr>
        <tr><td>Guests</td><td>${booking.numberOfPeople}</td></tr>
      </table>

      <h2>Payment</h2>
      <p>${paymentLine}</p>
      <span class="badge">CONFIRMED</span>

      <p style="margin-top:20px;">
        Warm regards,<br />
        <strong>LadakhTrails Team</strong>
        <strong>LadakhTrails Team</strong>
      </p>
      <p style="font-size:12px; margin-top:30px; border-top:1px solid #eee; padding-top:10px;">
        Please read our <a href="https://ladakh-trails.vercel.app/terms">Terms & Conditions</a>
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} LadakhTrails
    </div>
  </div>
</body>
</html>
`;

const adminEmailTemplate = (booking, paymentLine) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { background:#f4f6f8; font-family:Arial; }
    .container {
      max-width:620px; margin:30px auto; background:#fff;
      padding:26px; border-radius:10px;
    }
    h1 { color:#b91c1c; font-size:20px; }
    table { width:100%; font-size:14px; }
    td { padding:6px 0; }
    td:first-child { color:#6b7280; width:40%; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚨 New Booking Confirmed</h1>
    <table>
      <tr><td>Tour</td><td>${booking.tourName}</td></tr>
      <tr><td>Dates</td><td>${booking.startDate || "—"} to ${booking.endDate || "—"}</td></tr>
      <tr><td>Guests</td><td>${booking.numberOfPeople}</td></tr>
      <tr><td>Customer</td><td>${booking.fullName}</td></tr>
      <tr><td>Phone</td><td>${booking.phone}</td></tr>
    </table>

    <p><strong>Payment:</strong> ${paymentLine}</p>
    <p><strong>Booking ID:</strong> ${booking._id}</p>
    <p>
       <a href="https://ladakh-trails.vercel.app/terms">Terms & Conditions</a>
    </p>
  </div>
</body>
</html>
`;
