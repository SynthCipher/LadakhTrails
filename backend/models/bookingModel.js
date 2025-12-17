import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    tourDate: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    durationDays: {
      type: Number,
    },
    tourDateSlot: {
      type: String,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    // payment-related fields
    paymentOption: {
      type: String,
      enum: ["partial", "full", "none"],
      default: "none",
    },
    totalAmount: {
      type: Number, // total tour cost in INR
    },
    advanceAmount: {
      type: Number, // amount collected now (e.g. 30% for partial)
    },
    remainingAmount: {
      type: Number, // to be paid at tour start (for partial)
    },
    isAdvanceNonRefundable: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
