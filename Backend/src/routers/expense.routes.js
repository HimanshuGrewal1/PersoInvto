import { Router } from "express";
import { addExpense, getExpenses, updateExpense, deleteExpense, getUserCategories } from "../controllers/Expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes with JWT middleware
router.use(verifyJWT);

// Add a new expense
router.route("/").post(addExpense);

// Get all expenses of current user
router.route("/").get(getExpenses);

// Update an expense by ID
router.route("/:id").patch(updateExpense);

// Delete an expense by ID
router.route("/:id").delete(deleteExpense);

// Get user-defined categories
router.route("/categories").get(getUserCategories);

export default router;
