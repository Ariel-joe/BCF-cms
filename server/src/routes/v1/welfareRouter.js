import { Router } from "express";
import { createWelfare } from "../../controllers/welfare/welfareController.js";
import uploadImage from "../../middleware/multerImage.js";

const welfRouter = Router();

welfRouter.post("/welfare/create", uploadImage.single("image"), createWelfare);

export { welfRouter };
