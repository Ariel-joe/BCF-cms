import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

// Since CloudinaryStorage doesn't support per-field configs easily,
// we'll use a custom approach with multer's storage engine

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Different config based on field name
        if (file.fieldname === "image") {
            return {
                folder: "bcf_images",
                allowed_formats: ["jpg", "png", "jpeg"],
                resource_type: "auto",
            };
        } else if (file.fieldname === "pdf") {
            return {
                folder: "bcf_documents",
                resource_type: "raw",
                allowed_formats: ["pdf"],
            };
        }
    },
});

const upload = multer({ storage });

export const uploadBlogFiles = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
]);
