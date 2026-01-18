// ================== IMPORTS ==================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routes & Middleware
import AuthRouter from "./routes/auth.js";
import ExpenseRouter from "./routes/expense.js";
import authMiddleware from "./middleware/auth.middleware.js";

// DB Models
import { User } from "./db/User.js";
import { Group } from "./db/Group.js";
import { Expense } from "./db/Expense.js";

// ================== CONFIG ==================
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================== GLOBAL MIDDLEWARE ==================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ================== DATABASE ==================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================== BASIC ROUTES ==================
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ================== AUTH ROUTES ==================
app.use("/auth", AuthRouter);

// ================== USER ROUTES ==================

// Test protected route
app.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userID });
});

// Get logged-in user (basic)
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userID).select("name email avatarUrl");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
app.get("/user-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userID).select("name email avatarUrl");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user name
app.patch("/user-profile", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user avatar
app.patch("/user-avatar", authMiddleware, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatarUrl = avatarUrl;
    await user.save();

    res.json({ avatarUrl: user.avatarUrl });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================== FRIENDS ==================

// Get friends + friend requests
app.get("/user-friends", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userID)
      .select("friends friendRequests")
      .populate("friends", "name email avatarUrl")
      .populate("friendRequests", "name email avatarUrl");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Search users
app.get("/search-users", authMiddleware, async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required" });
    }

    const regex = new RegExp(query, "i");
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      _id: { $ne: req.userID },
    }).select("name email avatarUrl");

    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Friends list (used in add group)
app.get("/friends-list", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userID)
      .select("friends")
      .populate("friends", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ friends: user.friends });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================== SEND FRIEND REQUEST ==================
app.post("/send-friend-request/:id", authMiddleware, async (req, res) => {
  try {
    const senderId = req.userID;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Send request error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== ACCEPT FRIEND REQUEST ==================
app.post("/accept-friend-request/:id", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.userID;
    const senderId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const sender = await User.findById(senderId);

    if (!currentUser || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❗ If request does not exist, silently succeed
    if (!currentUser.friendRequests.includes(senderId)) {
      return res.json({ message: "Request already handled" });
    }

    // Remove request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== senderId
    );

    // Add friends ONLY if not already friends
    if (!currentUser.friends.includes(senderId)) {
      currentUser.friends.push(senderId);
    }

    if (!sender.friends.includes(currentUserId)) {
      sender.friends.push(currentUserId);
    }

    await currentUser.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Accept friend error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== REJECT FRIEND REQUEST ==================
app.post("/reject-friend-request/:id", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userID);

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== req.params.id
    );

    await currentUser.save();

    res.json({ message: "Friend request rejected" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});
// ================== REMOVE FRIEND ==================
app.post("/remove-friend/:id", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.userID;
    const friendId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const friend = await User.findById(friendId);

    if (!currentUser || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove each other from friends list
    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendId
    );

    friend.friends = friend.friends.filter(
      (id) => id.toString() !== currentUserId
    );

    await currentUser.save();
    await friend.save();

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("Remove friend error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//=============================================================================\

// ================== GROUPS ==================

// Add group
app.post("/add-group", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, members = [] } = req.body;

    const uniqueMembers = [...new Set([...members, req.userID])];

    const group = new Group({
      name,
      description,
      category,
      members: uniqueMembers,
      createdBy: req.userID,
    });

    await group.save();

    await User.updateMany(
      { _id: { $in: uniqueMembers } },
      { $addToSet: { groups: group._id } }
    );

    res.status(201).json(group);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all groups
app.get("/groups", authMiddleware, async (req, res) => {
  try {
    const groups = await User.findById(req.userID)
      .select("groups")
      .populate({
        path: "groups",
        select: "name category description members createdBy createdAt",
        populate: [
          { path: "members", select: "name avatarUrl" },
          { path: "createdBy", select: "name" },
        ],
      });

    if (!groups) {
      return res.status(404).json({ message: "No groups found" });
    }

    res.json(groups);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get group members
app.get("/group/:groupId/members", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members",
      "name avatarUrl"
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m._id.toString() === req.userID);

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ members: group.members });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});
// Get group details
app.get("/group/:groupId/details", authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.toString() === req.userID);

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(group);
  } catch (err) {
    console.error("Group details error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== EXPENSES ==================
app.use("/expense", authMiddleware, ExpenseRouter);

/* =====================================================
   ================== Settlement Summary ==================
   GET /group/:groupId/settlement
===================================================== */
app.get("/group/:groupId/settlement", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userID;

  try {
    /* ----------Group + Auth ---------- */
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    /* ---------- Fetch ALL expenses ---------- */
    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "_id name")
      .populate("splitAmong", "_id name");

    if (!expenses.length) {
      return res.json({ settlements: [] });
    }

    /* ---------- Balance Map ---------- */
    const balanceMap = {};

    expenses.forEach((expense) => {
      const payerId = expense.paidBy._id.toString();
      const split = expense.amount / expense.splitAmong.length;

      // payer paid full
      balanceMap[payerId] = (balanceMap[payerId] || 0) + expense.amount;

      // everyone owes split
      expense.splitAmong.forEach((u) => {
        const uid = u._id.toString();
        balanceMap[uid] = (balanceMap[uid] || 0) - split;
      });
    });

    /* ---------- Creditors & Debtors ---------- */
    const EPSILON = 0.001;
    const creditors = [];
    const debtors = [];

    Object.entries(balanceMap).forEach(([uid, amount]) => {
      if (amount > EPSILON) {
        creditors.push({ uid, amount });
      } else if (amount < -EPSILON) {
        debtors.push({ uid, amount: Math.abs(amount) });
      }
    });

    /* ---------- Minimize transactions ---------- */
    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i];
      const c = creditors[j];
      const pay = Math.min(d.amount, c.amount);

      settlements.push({
        from: d.uid,
        to: c.uid,
        amount: Number(pay.toFixed(2)),
      });

      d.amount -= pay;
      c.amount -= pay;

      if (d.amount <= EPSILON) i++;
      if (c.amount <= EPSILON) j++;
    }

    /* ---------- Attach user names ---------- */
   
    const userIdsSet = new Set();

    settlements.forEach((s) => {
      userIdsSet.add(s.from);
      userIdsSet.add(s.to);
    });

    const userIds = Array.from(userIdsSet);

    const users = await User.find({ _id: { $in: userIds } }, { name: 1 });

    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = u.name;
    });

    const finalSettlements = settlements.map((s) => ({
      from: { _id: s.from, name: userMap[s.from] },
      to: { _id: s.to, name: userMap[s.to] },
      amount: s.amount,
    }));

    return res.json({ settlements: finalSettlements });
  } catch (err) {
    console.error("Settlement Error:", err);
    return res.status(500).json({ message: "Failed to fetch settlement" });
  }
});

/* =====================================================
   ================== Net Balance ==================
   GET /group/:groupId/net-balance
===================================================== */
app.get("/group/:groupId/net-balance", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userID;

  try {
    /* ----------  Group + Auth ---------- */
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    /* ----------  Fetch all expenses ---------- */
    const expenses = await Expense.find({ groupId });

    let balance = 0;

    /* ----------  Balance calculation ---------- */
    expenses.forEach((expense) => {
      const payerId = expense.paidBy.toString();
      const split = expense.amount / expense.splitAmong.length;

      if (payerId === userId) {
        balance += expense.amount;
      }

      if (expense.splitAmong.some((u) => u.toString() === userId)) {
        balance -= split;
      }
    });

    return res.json({
      netBalance: Number(balance.toFixed(2)),
    });
  } catch (err) {
    console.error("Net Balance Error:", err);
    return res.status(500).json({ message: "Failed to calculate net balance" });
  }
});

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
