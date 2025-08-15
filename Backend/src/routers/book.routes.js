import { Router } from "express";
import {addBook,getBooks,updateBook,deleteBook } from "../controllers/Book.controller.js";
import { upload } from "../middlewares/multer.mw.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT);
router.route("/").post(verifyJWT, upload.single("coverImage"), addBook)
router.route("/").get(verifyJWT, getBooks)
router.route("/:id").patch(updateBook);


router.route("/:id").delete(deleteBook);


export default router