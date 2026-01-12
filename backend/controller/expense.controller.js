import { Expense } from "../db/Expense.js";
import { Group } from "../db/Group.js";
import mongoose from "mongoose";

export const expenseAddController = async (req, res) => {
  try {
    const {
      groupId,
      description,
      amount,
      category,
      paidBy,
      splitAmong = [],
    } = req.body;

    if (
      !groupId ||
      !description ||
      !amount ||
      !paidBy ||
      splitAmong.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const expense = await Expense.create({
      groupId,
      description,
      amount,
      category,
      paidBy,
      splitAmong,
    });

    const update = {
      $push: { expenses: expense._id },
    };

    // Only non-settlement increases totalExpense
    if (category !== "settlement") {
      update.$inc = { totalExpense: amount };
    }

    await Group.findByIdAndUpdate(groupId, update);

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expenseId: expense._id,
    });
  } catch (err) {
    console.error("Add Expense Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/*
GET /expense/group/:groupId
Returns all expenses of a group
*/

export const expenseDataController = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // auth check
    const isMember = group.members.some((m) => m.toString() === req.userID);

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "name avatarUrl")
      .populate("splitAmong", "name avatarUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({ expenses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
GET /expense/ExpenseCategoryChart/:groupId
Returns category-wise total expense for a group
*/

export const expenseCategoryChartController = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID required" });
    }

    // Check group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    //  Auth check (member only)
    const isMember = group.members.some((m) => m.toString() === req.userID);

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //  Aggregate expenses category-wise
    const result = await Expense.aggregate([
      {
        $match: {
          groupId: group._id,
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Convert aggregation to frontend-friendly object
    const categoryData = {
      food: 0,
      travel: 0,
      stay: 0,
      shopping: 0,
      party: 0,
      other: 0,
    };

    result.forEach((item) => {
      if (item._id && categoryData.hasOwnProperty(item._id)) {
        categoryData[item._id] = item.totalAmount;
      }
    });

    return res.status(200).json(categoryData);
  } catch (err) {
    console.error("Expense Category Chart Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
GET /expense/groupExpenseSummary
Returns total expense per group for logged-in user
*/

export const groupExpenseSummaryController = async (req, res) => {
  try {
    const userId = req.userID;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find groups where user is a member
    const groups = await Group.find({
      members: userId,
    }).select("_id name totalExpense");

    // Format response
    const summary = groups.map((group) => ({
      groupId: group._id,
      groupName: group.name,
      totalExpense: group.totalExpense || 0,
    }));

    return res.status(200).json(summary);
  } catch (err) {
    console.error("Group Expense Summary Error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/*
GET /expense/dashboardCategoryBreakdown
Returns category-wise expense across all user's groups
*/

export const dashboardCategoryBreakdownController = async (req, res) => {
  try {
    const userId = req.userID;

    //  Get all groups of user
    const groups = await Group.find({
      members: userId,
    }).select("_id");

    const groupIds = groups.map((g) => g._id);

    // Aggregate expenses
    const result = await Expense.aggregate([
      {
        $match: {
          groupId: { $in: groupIds },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Normalize response
    const categoryData = {
      food: 0,
      travel: 0,
      stay: 0,
      shopping: 0,
      party: 0,
      other: 0,
    };

    result.forEach((item) => {
      if (item._id && categoryData[item._id] !== undefined) {
        categoryData[item._id] = item.totalAmount;
      }
    });

    return res.status(200).json(categoryData);
  } catch (err) {
    console.error("Dashboard Category Breakdown Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
GET /expense/monthlyUserExpense
Returns month-wise USER SHARE of expenses (current year)
*/

export const monthlyUserExpenseController = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.userID);

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

    const result = await Expense.aggregate([
      {
        $match: {
          splitAmong: userObjectId,
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $addFields: {
          userShare: {
            $divide: ["$amount", { $size: "$splitAmong" }],
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$userShare" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Normalize Jan–Dec
    const monthlyData = Array(12).fill(0);

    result.forEach((item) => {
      monthlyData[item._id - 1] = Math.round(item.totalAmount);
    });

    return res.status(200).json(monthlyData);
  } catch (err) {
    console.error("Monthly Expense Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


