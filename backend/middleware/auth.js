import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // attach admin info if needed
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
