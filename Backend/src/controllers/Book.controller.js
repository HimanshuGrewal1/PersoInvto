import { Book } from "../modles/Books.modle.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponce } from "../utils/Apiresponce.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new book
const addBook = asynchandler(async (req, res) => {
    const { title, author, genre, status } = req.body;

    if (!title || !author || !status) {
        throw new ApiError(400, "Title, author, and status are required");
    }

    const book = await Book.create({
        title,
        author,
        genre,
        status,
        user: req.user._id
    });

    return res.status(201).json(new ApiResponce(201, book, "Book added successfully"));
});

// Get all books of current user
const getBooks = asynchandler(async (req, res) => {
    const books = await Book.find({ user: req.user._id });
    return res.status(200).json(new ApiResponce(200, books, "Books fetched successfully"));
});

// Update a book by ID
const updateBook = asynchandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const book = await Book.findOneAndUpdate(
        { _id: id, user: req.user._id },
        updatedData,
        { new: true }
    );

    if (!book) {
        throw new ApiError(404, "Book not found or unauthorized");
    }

    return res.status(200).json(new ApiResponce(200, book, "Book updated successfully"));
});

// Delete a book by ID
const deleteBook = asynchandler(async (req, res) => {
    const { id } = req.params;

    const book = await Book.findOneAndDelete({ _id: id, user: req.user._id });

    if (!book) {
        throw new ApiError(404, "Book not found or unauthorized");
    }

    return res.status(200).json(new ApiResponce(200, {}, "Book deleted successfully"));
});

export { addBook, getBooks, updateBook, deleteBook };
