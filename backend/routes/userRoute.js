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

    // List of allowed admins (Master from env + additional accounts)
    const allowedAdmins = [
      { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      // You can add more admins here interactively:
      { email: "rinchen@ladakhtrails.com", password: "ladakh_admin_01" },
      { email: "namgail@ladakhtrails.com", password: "ladakh_admin_02" },
    ];

    const isValidAdmin = allowedAdmins.find(
      (admin) =>
        admin.email &&
        admin.password &&
        admin.email === email &&
        admin.password === password
    );

    if (isValidAdmin) {
      const token = jwt.sign(
        { isAdmin: true, email: email },
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
