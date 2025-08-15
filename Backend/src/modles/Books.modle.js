import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    author: { type: String },
    status: { type: String, enum: ["Read", "Reading", "Will Read"], default: "Will Read" },
    genre: [{ type: String }],
    coverImage: { type: String },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
