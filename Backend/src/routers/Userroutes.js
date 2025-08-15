import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refershAccessToken, registerUser, updateAccountDetails, updateuseravatar, updateusercoverimage } from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.mw.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refershAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-user").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateuseravatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateusercoverimage)


export default router