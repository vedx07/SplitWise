// middleware/groupAccess.middleware.js
import { Group } from "../db/Group.js";

const groupAccessMiddleware = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.userID;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (m) => m.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied: You are not a group member",
      });
    }

    // attach group for reuse
    req.group = group;
    next();
  } catch (err) {
    console.error("Group access error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default groupAccessMiddleware;