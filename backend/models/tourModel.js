import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    tourName: {
      type: String,
      required: true,
      trim: true,
    },
    tourType: {
      type: String,
      enum: ["General", "Wildlife", "Winter Sports", "Birding"],
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    highlights: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isPlanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
