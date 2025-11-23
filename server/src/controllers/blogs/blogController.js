import mongoose from "mongoose";
import { Blog } from "../../database/blog.js";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";

// create a blog
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

// fetch all blogs
export const allBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "name email");
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        console.error("Fetch all blogs error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// fetch single blog by id
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid blog ID",
            });
        }
        const blog = await Blog.findById(id).populate("author", "name email");
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error("Fetch blog by ID error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// TODO: make sure only author or admin can update/delete //also check if one can update the imagess/pdf

// update blog by id
export const updateBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid blog ID",
            });
        }
        const updatedData = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!updatedBlog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data: updatedBlog,
        });
    } catch (error) {
        console.error("Update blog by ID error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};

// delete blog by id
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid blog ID",
            });
        }
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error("Delete blog by ID error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Please try again!",
        });
    }
};
