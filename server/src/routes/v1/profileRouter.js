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
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";

const profileRouter = Router();

// Public routes (if any)
profileRouter.get("/profile", fetchAllProfiles);
profileRouter.get("/profile/:id", getProfileById);

// Protected routes
profileRouter.post(
    "/profile/create",
    authMiddleware,
    permissionLoader,
    checkPermission("profile:create"),
    uploadImage.single("image"),
    createProfile
);

profileRouter.put(
    "/profile/update/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("profile:update"),
    uploadImage.single("image"),
    updateProfileById
);

profileRouter.delete(
    "/profile/delete/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("profile:delete"),
    deleteProfileById
);

export { profileRouter };
