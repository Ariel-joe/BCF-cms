import mongoose from "mongoose";
import { Blog } from "../../database/blog.js";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";

export const createBlog = async (req, res) => {
    try {
        const { title, summary, pdfTitle } = req.body;

        // Parse content from JSON string
        let content;
        try {
            content = JSON.parse(req.body.content);
        } catch (error) {
            throw new Error("Invalid content format");
        }

        // tags[] is already parsed by Express as an array
        const tags = req.body["tags[]"] || req.body.tags || [];

        const userId = req.user.id;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        const imageUrl =
            req.files?.image && req.files.image.length > 0
                ? req.files.image[0].path
                : null;

        if (!imageUrl) {
            throw new Error("Featured image is required");
        }

        const pdfUrl =
            req.files?.pdf && req.files.pdf.length > 0
                ? req.files.pdf[0].path
                : null;

        const newBlog = await Blog.create({
            image: imageUrl,
            datePublished: Date.now(),
            title,
            summary,
            content: content,
            tags: Array.isArray(tags) ? tags : [tags],
            pdf: {
                title: pdfTitle || null,
                url: pdfUrl || null,
            },
            author: user._id,
        });

        if (!newBlog) {
            throw new Error("Cannot create the blog!");
        }

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Blog created successfully",
            data: newBlog,
        });
    } catch (error) {
        console.error("Blog creation error:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};
