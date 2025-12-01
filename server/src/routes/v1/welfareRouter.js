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

const welfRouter = Router();

welfRouter.get("/welfare", getAllWelfares);
welfRouter.post("/welfare/create",authMiddleware, uploadImage.single("image"), createWelfare);
welfRouter.get("/welfare/:id", authMiddleware, getWelfareById);
welfRouter.put(
    "/welfare/update/:id",
    authMiddleware,
    uploadImage.single("image"),
    updateWelfareById
);
welfRouter.delete("/welfare/delete/:id", authMiddleware, deleteWelfareById);
export { welfRouter };
