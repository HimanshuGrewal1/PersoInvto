import mongoose from "mongoose";
const { Schema } = mongoose;

// Expense Schema
const expenseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String, // Allow custom categories
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

export const Expense = mongoose.model("Expense", expenseSchema);
