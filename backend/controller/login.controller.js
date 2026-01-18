import { User } from "../db/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",//Sent on normal navigation (clicking a link)
      secure: false, // now HTTP and HTTPS both works, true in production only (HTTPS)
    });
    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
}
