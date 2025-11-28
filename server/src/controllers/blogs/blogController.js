import mongoose from "mongoose";
import { Blog } from "../../database/blog.js";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../middleware/blogMulter.js";

/// create a blog
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

        // ------------------------------
        // NEW CLOUDINARY UPLOAD HANDLING
        // ------------------------------

        let imageUrl = null;
        let pdfUrl = null;

        // Upload image if present
        if (req.files?.image && req.files.image.length > 0) {
            const imageFile = req.files.image[0];
            const uploadedImage = await uploadToCloudinary(
                imageFile.buffer,
                "image" // fieldname
            );
            imageUrl = uploadedImage.secure_url;
        }

        if (!imageUrl) {
            throw new Error("Featured image is required");
        }

        // Upload PDF if present
        if (req.files?.pdf && req.files.pdf.length > 0) {
            const pdfFile = req.files.pdf[0];
            const uploadedPdf = await uploadToCloudinary(
                pdfFile.buffer,
                "pdf" // fieldname
            );
            pdfUrl = uploadedPdf.secure_url;
        }

        // ------------------------------
        // CREATE BLOG
        // ------------------------------

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
// Update blog by id with file handling
// Update blog by id with file handling
// Update blog by id with file handling
export const updateBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid blog ID",
            });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Blog not found",
            });
        }

        // Clone req.body
        const updatedData = { ...req.body };

        // Parse tags[] if sent as string from FormData
        if (req.body["tags[]"]) {
            updatedData.tags = Array.isArray(req.body["tags[]"])
                ? req.body["tags[]"]
                : [req.body["tags[]"]];
            delete updatedData["tags[]"];
        }

        // Parse content JSON string
        if (typeof updatedData.content === "string") {
            try {
                updatedData.content = JSON.parse(updatedData.content);
            } catch (e) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid content format",
                });
            }
        }

        // ----------------------------
        // Handle Image Upload (Optional)
        // ----------------------------
        if (req.files?.image && req.files.image.length > 0) {
            const uploadedImage = await uploadToCloudinary(
                req.files.image[0].buffer,
                "image"
            );
            updatedData.image = uploadedImage.secure_url;
        }

        // ----------------------------
        // Handle PDF Upload / Removal
        // ----------------------------
        if (req.files?.pdf && req.files.pdf.length > 0) {
            const uploadedPdf = await uploadToCloudinary(
                req.files.pdf[0].buffer,
                "pdf"
            );
            updatedData.pdf = {
                title: req.body.pdfTitle || req.files.pdf[0].originalname,
                url: uploadedPdf.secure_url,
            };
        } else if (req.body.removePdf === "true") {
            updatedData.pdf = null;
        }
        // else keep existing PDF

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        }).populate("author", "name email");

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
