import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = decoded.userId;
    // console.log("User ID from token:", req.userID);
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}