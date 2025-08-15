import { Anime } from "../modles/Anime.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponce } from "../utils/Apiresponce.js";
import { ApiError } from "../utils/ApiError.js";

// Add a new anime
const addAnime = asynchandler(async (req, res) => {
    const { title, genre, totalEpisodes, seasonal, status } = req.body;

    if (!title || !status || !genre || totalEpisodes === undefined) {
        throw new ApiError(400, "Title, status, genre, and total episodes are required");
    }

    const anime = await Anime.create({
        title,
        genre,
        totalEpisodes,
        seasonal,
        status,
        user: req.user._id
    });

    return res.status(201).json(new ApiResponce(201, anime, "Anime added successfully"));
});

// Get all animes of current user
const getAnimes = asynchandler(async (req, res) => {
    const animes = await Anime.find({ user: req.user._id });
    return res.status(200).json(new ApiResponce(200, animes, "Animes fetched successfully"));
});

// Update an anime by ID
const updateAnime = asynchandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const anime = await Anime.findOneAndUpdate(
        { _id: id, user: req.user._id },
        updatedData,
        { new: true }
    );

    if (!anime) {
        throw new ApiError(404, "Anime not found or unauthorized");
    }

    return res.status(200).json(new ApiResponce(200, anime, "Anime updated successfully"));
});

// Delete an anime by ID
const deleteAnime = asynchandler(async (req, res) => {
    const { id } = req.params;

    const anime = await Anime.findOneAndDelete({ _id: id, user: req.user._id });

    if (!anime) {
        throw new ApiError(404, "Anime not found or unauthorized");
    }

    return res.status(200).json(new ApiResponce(200, {}, "Anime deleted successfully"));
});

export { addAnime, getAnimes, updateAnime, deleteAnime };
