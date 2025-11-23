import { Router } from "express";
import { createBlog } from "../../controllers/blogs/blogController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { uploadBlogFiles } from "../../middleware/blogMulter.js";

const blogRouter = Router();

blogRouter.post(
    "/blog/create",
    authMiddleware,
    uploadBlogFiles,
    createBlog
);

export { blogRouter };
