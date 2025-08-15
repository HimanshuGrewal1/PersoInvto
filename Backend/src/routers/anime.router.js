import { Router } from "express";
import { addAnime, getAnimes, updateAnime, deleteAnime } from "../controllers/Anime.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes with JWT middleware
router.use(verifyJWT);

// Add a new anime
router.route("/").post(addAnime);

// Get all animes of current user
router.route("/").get(getAnimes);

// Update an anime by ID
router.route("/:id").patch(updateAnime);

// Delete an anime by ID
router.route("/:id").delete(deleteAnime);

export default router;
