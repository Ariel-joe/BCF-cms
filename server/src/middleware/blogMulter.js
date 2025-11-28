import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

// --- Modern Multer Setup (Memory Storage) ---
const storage = multer.memoryStorage();

// This remains the same variable name
const upload = multer({ storage });

// Keep the same exported middleware (field names unchanged)
export const uploadBlogFiles = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
]);

// --- New helper to replace CloudinaryStorage (stream upload) ---
export const uploadToCloudinary = (fileBuffer, fieldname) => {
    return new Promise((resolve, reject) => {
        // Choose folder based on the fieldname
        let options = {};

        if (fieldname === "image") {
            options = {
                folder: "bcf_images",
                allowed_formats: ["jpg", "png", "jpeg"],
                resource_type: "image",
            };
        } else if (fieldname === "pdf") {
            options = {
                folder: "bcf_documents",
                resource_type: "raw",
                allowed_formats: ["pdf"],
            };
        }

        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};
