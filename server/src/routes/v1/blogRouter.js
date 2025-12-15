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
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";


const blogRouter = Router();

// Public routes
blogRouter.get("/blog", allBlogs); // Anyone can view all blogs
blogRouter.get("/blog/:id", getBlogById);

// Protected routes
blogRouter.post(
    "/blog/create",
    authMiddleware,
    permissionLoader,
    checkPermission(["blog:create"], "AND"),
    uploadBlogFiles,
    createBlog
);

blogRouter.put(
    "/blog/update/:id",
    authMiddleware,
    permissionLoader,
    checkPermission(["blog:update"], "AND"),
    uploadBlogFiles,
    updateBlogById
);

blogRouter.delete(
    "/blog/delete/:id",
    authMiddleware,
    permissionLoader,
    checkPermission(["blog:delete"], "AND"),
    deleteBlogById
);

export { blogRouter };
