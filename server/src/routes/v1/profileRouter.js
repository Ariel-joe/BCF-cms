import { Router } from "express";
import {
    createProfile,
    deleteProfileById,
    fetchAllProfiles,
    getProfileById,
    updateProfileById,
} from "../../controllers/profiles/profilesController.js";
import uploadImage from "../../middleware/multerImage.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const profileRouter = Router();

profileRouter.post(
    "/profile/create",
    uploadImage.single("image"),
    createProfile
);
profileRouter.get("/profile", fetchAllProfiles);
profileRouter.get("/profile/:id", authMiddleware,getProfileById);
profileRouter.put(
    "/profile/update/:id",
    authMiddleware,
    uploadImage.single("image"),
    updateProfileById
);
profileRouter.delete("/profile/delete/:id", authMiddleware, deleteProfileById);

export { profileRouter };
