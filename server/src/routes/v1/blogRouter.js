import { Router } from "express";
import {
    allBlogs,
    createBlog,
    deleteBlogById,
    getBlogById,
    updateBlogById,
} from "../../controllers/blogs/blogController.js";
import { uploadBlogFiles } from "../../middleware/blogMulter.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const blogRouter = Router();

blogRouter.get("/blog", allBlogs);
blogRouter.get("/blog/:id", getBlogById);
blogRouter.post("/blog/create",authMiddleware, uploadBlogFiles, createBlog);
blogRouter.put("/blog/update/:id", authMiddleware, uploadBlogFiles, updateBlogById); 
blogRouter.delete("/blog/delete/:id", authMiddleware, deleteBlogById);

export { blogRouter };
