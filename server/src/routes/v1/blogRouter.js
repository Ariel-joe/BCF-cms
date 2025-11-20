import { Router } from "express";
import { createBlog } from "../../controllers/blogs/blogController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import uploadImage from "../../middleware/multerImage.js";
import uploadPdf from "../../middleware/multerPdf.js";

const blogRouter = Router();

blogRouter.post(
    "/blog/create",
    authMiddleware,
    (req, res, next) => {
        uploadImage.fields([{ name: "image", maxCount: 1 }])(
            req,
            res,
            function (err) {
                if (err) return next(err);
                uploadPdf.fields([{ name: "pdf", maxCount: 1 }])(
                    req,
                    res,
                    next
                );
            }
        );
    },
    createBlog
);

export { blogRouter };
