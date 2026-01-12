
export default async function logoutController(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,   // true in production (HTTPS)
      sameSite: "lax", // MUST match login cookie
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}

