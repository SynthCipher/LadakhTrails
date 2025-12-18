import "dotenv/config";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

async function testConnections() {
    console.log("🚀 Starting EXTENDED connection tests...");

    // 1. Test MongoDB
    console.log("\n--- Testing MongoDB ---");
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
    }

    // 2. Test Cloudinary (Config Check)
    console.log("\n--- Testing Cloudinary ---");
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
        });
        const ping = await cloudinary.api.ping();
        console.log("✅ Cloudinary Ping Response:", ping);
    } catch (error) {
        console.error("❌ Cloudinary Error:", error.message);
    }

    // 3. Test SMTP (Brevo)
    console.log("\n--- Testing SMTP (Brevo) ---");
    try {
        const { SMTP_USER, SMTP_PASS, SENDER_EMAIL } = process.env;
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        await transporter.verify();
        console.log("✅ SMTP Connection Verified");
    } catch (error) {
        console.error("❌ SMTP Connection Failed:", error);
    }

    console.log("\nWaiting 10 seconds to catch delayed errors...");
    await new Promise(r => setTimeout(r, 10000));
    
    console.log("Tests completed.");
    process.exit(0);
}

testConnections();
