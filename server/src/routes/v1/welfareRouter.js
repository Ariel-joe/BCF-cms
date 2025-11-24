import { Router } from "express";
import {
    createWelfare,
    getAllWelfares,
    getWelfareById,
} from "../../controllers/welfare/welfareController.js";
import uploadImage from "../../middleware/multerImage.js";

const welfRouter = Router();

welfRouter.post("/welfare/create", uploadImage.single("image"), createWelfare);
welfRouter.get("/welfare", getAllWelfares);
welfRouter.get("/welfare/:id", getWelfareById);

export { welfRouter };
