import { Router } from "express";
import { createBlog } from "../../controllers/blogs/blogController.js";

const blogRouter = new Router();

blogRouter.post("blog/create",(req, res, next) => {
    uploadImage.fields([{ name: "image", maxCount: 1 }])(req, res, function (err) {
      if (err) return next(err);
      uploadPdf.fields([{ name: "pdf", maxCount: 1 }])(req, res, next);
    });
  }, createBlog);

export { blogRouter };
