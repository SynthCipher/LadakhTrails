import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/user/admin
// Checks credentials against env vars and returns a JWT when valid
router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Admin not configured on server",
      });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { isAdmin: true },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "1d",
        }
      );
      return res.json({ success: true, token, message: "Admin authenticated" });
    }

    return res.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
});

export default router;
