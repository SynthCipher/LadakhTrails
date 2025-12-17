import express from "express";
import Tour from "../models/tourModel.js";
import Booking from "../models/bookingModel.js";
import upload from "../middleware/multer.js";
import { v2 as cloudinary } from "cloudinary";
import { verifyAdmin } from "../middleware/auth.js";

const tourRouter = express.Router();

// Add new tour with image upload
tourRouter.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      tourName,
      tourType,
      startDate,
      endDate,
      price,
      availableSeats,
      description,
      highlights,
    } = req.body;

    let imageUrl = "";

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "namgail-tours",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.json({
          success: false,
          message: "Image upload failed: " + error.message,
        });
      }
    }

    const newTour = new Tour({
      tourName,
      tourType,
      startDate,
      endDate,
      price,
      availableSeats,
      description,
      highlights,
      isPlanned: req.body.isPlanned === "true" || req.body.isPlanned === true,
      image: imageUrl,
    });

    const savedTour = await newTour.save();
    res.json({ success: true, tour: savedTour });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Update tour
tourRouter.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      tourName,
      tourType,
      startDate,
      endDate,
      price,
      availableSeats,
      description,
      highlights,
    } = req.body;

    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.json({ success: false, message: "Tour not found" });
    }

    let imageUrl = tour.image;

    // Upload new image if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "namgail-tours",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.json({
          success: false,
          message: "Image upload failed: " + error.message,
        });
      }
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        tourName,
        tourType,
        startDate,
        endDate,
        price,
        availableSeats,
        description,
        highlights,
        isPlanned: req.body.isPlanned === "true" || req.body.isPlanned === true,
        image: imageUrl,
      },
      { new: true }
    );

    res.json({ success: true, tour: updatedTour });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Delete tour
tourRouter.delete("/delete/:id", async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Tour deleted" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Get all tours
tourRouter.get("/all", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json({ success: true, tours });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Get single tour
tourRouter.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.json({ success: true, tour });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Get tours by type (optionally only planned)
tourRouter.get("/type/:tourType", async (req, res) => {
  try {
    const { tourType } = req.params;
    const { planned } = req.query;
    const query = { tourType };
    if (planned === "true") query.isPlanned = true;
    const tours = await Tour.find(query);
    res.json({ success: true, tours });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Add booking for a tour
tourRouter.post("/booking/add", async (req, res) => {
  try {
    const {
      tourId,
      tourName,
      fullName,
      email,
      phone,
      numberOfPeople,
      // new fields
      tourDateSlot,
      startDate,
      endDate,
      durationDays,
      specialRequests,
      tourDate,
    } = req.body;

    // determine tourDate string for backward compatibility
    const tourDateString =
      tourDateSlot ||
      (startDate && endDate ? `${startDate} - ${endDate}` : tourDate || "");

    const newBooking = new Booking({
      tourId,
      tourName,
      fullName,
      email,
      phone,
      numberOfPeople,
      tourDate: tourDateString,
      tourDateSlot,
      startDate,
      endDate,
      durationDays: durationDays ? Number(durationDays) : undefined,
      specialRequests,
    });

    const savedBooking = await newBooking.save();
    res.json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Get all bookings for a specific tour
tourRouter.get("/booking/:tourId", async (req, res) => {
  try {
    const bookings = await Booking.find({ tourId: req.params.tourId });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Get all bookings
tourRouter.get("/bookings/all", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Get booking count for a tour
tourRouter.get("/booking/count/:tourId", async (req, res) => {
  try {
    const count = await Booking.countDocuments({ tourId: req.params.tourId });
    res.json({ success: true, count });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

// Update booking status (admin only or provide admin password header as fallback)
tourRouter.put("/booking/status", async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!bookingId || !status)
      return res.json({
        success: false,
        message: "bookingId and status are required",
      });

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    // Verify admin via JWT or fallback to admin password header
    const token = req.headers.token || req.headers.authorization;
    let allowed = false;
    if (token) {
      try {
        const secret = process.env.JWT_SECRET || "secret";
        const decoded = require("jsonwebtoken").verify(token, secret);
        if (decoded && decoded.isAdmin) allowed = true;
      } catch (e) {
        // invalid token
      }
    }

    if (!allowed) {
      const adminPassword = req.headers["x-admin-password"];
      if (adminPassword && adminPassword === process.env.ADMIN_PASSWORD)
        allowed = true;
    }

    if (!allowed)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    if (!updated)
      return res.json({ success: false, message: "Booking not found" });
    res.json({
      success: true,
      booking: updated,
      message: "Booking status updated",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

export default tourRouter;
