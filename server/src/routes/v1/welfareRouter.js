import { Router } from "express";
import {
    createWelfare,
    deleteWelfareById,
    getAllWelfares,
    getWelfareById,
    updateWelfareById,
} from "../../controllers/welfare/welfareController.js";
import uploadImage from "../../middleware/multerImage.js";

const welfRouter = Router();

welfRouter.post("/welfare/create", uploadImage.single("image"), createWelfare);
welfRouter.get("/welfare", getAllWelfares);
welfRouter.get("/welfare/:id", getWelfareById);
welfRouter.put(
    "/welfare/update/:id",
    uploadImage.single("image"),
    updateWelfareById
);
welfRouter.delete("/welfare/delete/:id", deleteWelfareById);

export { welfRouter };
