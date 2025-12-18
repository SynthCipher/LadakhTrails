import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import tourRouter from "./routes/tourRoute.js";
import userRouter from "./routes/userRoute.js";
import paymentRouter from "./routes/paymentRoute.js";

// APP CONFIG
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(err.name, err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(err);
});

const app = express();
const port = process.env.PORT || 8081;

// Connect to database
(async () => {
  await connectDB();
  await connectCloudinary();
})();

import helmet from "helmet";

// MIDDLE WARE
app.use(express.json());
app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",
  "https://ladakh-trails.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173", // Vite
  "http://localhost:5174", // Vite
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// API END POINT
app.use("/api/tour", tourRouter);

// User / Auth endpoints
app.use("/api/user", userRouter);

// Payment endpoints (Razorpay)
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("hello Server is Working");
});

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
