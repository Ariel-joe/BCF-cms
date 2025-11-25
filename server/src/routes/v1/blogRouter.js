import { Router } from "express";
import {
    allBlogs,
    createBlog,
    deleteBlogById,
    getBlogById,
    updateBlogById,
} from "../../controllers/blogs/blogController.js";
import { uploadBlogFiles } from "../../middleware/blogMulter.js";

const blogRouter = Router();

blogRouter.post("/blog/create", uploadBlogFiles, createBlog);
blogRouter.get("/blog", allBlogs);
blogRouter.get("/blog/:id", getBlogById);
blogRouter.put("/blog/update/:id", uploadBlogFiles, updateBlogById); //TODO: add uploadBlogFiles if updating files is needed
blogRouter.delete("/blog/delete/:id", deleteBlogById);

export { blogRouter };
