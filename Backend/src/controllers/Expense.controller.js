import { Expense } from "../modles/expense.modle.js";
import { User } from "../modles/User.modle.js";  // Import User model
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponce } from "../utils/Apiresponce.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new expense
const addExpense = asynchandler(async (req, res) => {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date) {
        throw new ApiError(400, "Amount, category, and date are required");
    }

    // Check if the category is custom (not pre-defined) and add it to user's custom categories
    const user = await User.findById(req.user._id);

    if (user && !user.customCategories.includes(category)) {
        // Add new custom category to the user's list
        user.customCategories.push(category);
        await user.save();
    }

    const expense = await Expense.create({
        amount,
        category,
        date,
        description,
        user: req.user._id,
    });

    return res.status(201).json(new ApiResponce(201, expense, "Expense added successfully"));
});

// Get all expenses of current user
const getExpenses = asynchandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id });
    return res.status(200).json(new ApiResponce(200, expenses, "Expenses fetched successfully"));
});

// Update an expense by ID
const updateExpense = asynchandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const expense = await Expense.findOneAndUpdate(
        { _id: id, user: req.user._id },
        updatedData,
        { new: true }
    );

    if (!expense) {
        throw new ApiError(404, "Expense not found or unauthorized");
    }

    return res.status(200).json(new ApiResponce(200, expense, "Expense updated successfully"));
});

// Delete an expense by ID
const deleteExpense = asynchandler(async (req, res) => {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

    if (!expense) {
        throw new ApiError(404, "Expense not found or unauthorized");
    }

    return res.status(200).json(new ApiResponce(200, {}, "Expense deleted successfully"));
});

// Get user-defined categories
const getUserCategories = asynchandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('customCategories');
    return res.status(200).json(new ApiResponce(200, user.customCategories, "User's custom categories fetched successfully"));
});

export { addExpense, getExpenses, updateExpense, deleteExpense, getUserCategories };
