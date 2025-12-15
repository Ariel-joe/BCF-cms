import { Router } from "express";
import {
    createWelfare,
    deleteWelfareById,
    getAllWelfares,
    getWelfareById,
    updateWelfareById,
} from "../../controllers/welfare/welfareController.js";
import uploadImage from "../../middleware/multerImage.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";

const welfRouter = Router();

// Public routes — anyone can view welfare posts
welfRouter.get("/welfare", getAllWelfares);
welfRouter.get("/welfare/:id", getWelfareById);

// Protected routes — only users with proper permissions
welfRouter.post(
    "/welfare/create",
    authMiddleware,
    permissionLoader,
    checkPermission("welfare:create"),
    uploadImage.single("image"),
    createWelfare
);

welfRouter.put(
    "/welfare/update/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("welfare:update"),
    uploadImage.single("image"),
    updateWelfareById
);

welfRouter.delete(
    "/welfare/delete/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("welfare:delete"),
    deleteWelfareById
);

export { welfRouter };
