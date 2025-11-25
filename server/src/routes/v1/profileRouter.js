import { Router } from "express";
import {
    createProfile,
    deleteProfileById,
    fetchAllProfiles,
    getProfileById,
    updateProfileById,
} from "../../controllers/profiles/profilesController.js";
import uploadImage from "../../middleware/multerImage.js";

const profileRouter = Router();

profileRouter.post(
    "/profile/create",
    uploadImage.single("image"),
    createProfile
);
profileRouter.get("/profile", fetchAllProfiles);
profileRouter.get("/profile/:id", getProfileById);
profileRouter.put(
    "/profile/update/:id",
    uploadImage.single("image"),
    updateProfileById
);
profileRouter.delete("/profile/delete/:id", deleteProfileById);

export { profileRouter };
