import { Router } from "express";
import mongoose from 'mongoose'
import {
  expenseAddController,
  expenseDataController,
  expenseCategoryChartController,
  groupExpenseSummaryController,
  dashboardCategoryBreakdownController,
  monthlyUserExpenseController,
} from "../controller/expense.controller.js";


const ExpenseRouter = Router();

ExpenseRouter.get("/", (req, res) => {
  res.send("Expense Route");
});
ExpenseRouter.post("/add",expenseAddController);
ExpenseRouter.get("/group/:groupId",expenseDataController);

ExpenseRouter.get(
  "/ExpenseCategoryChart/:groupId",
  expenseCategoryChartController
);

ExpenseRouter.get(
  "/groupExpenseSummary",
  groupExpenseSummaryController
);
ExpenseRouter.get(
  "/dashboardCategoryBreakdown",
  dashboardCategoryBreakdownController
);

ExpenseRouter.get(
  "/monthlyUserExpense",
  monthlyUserExpenseController
);


// ExpenseRouter.post(
//   "/:groupId/settleup",
//   expenseSettleUpController
// );

export default ExpenseRouter;