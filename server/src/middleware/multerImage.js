import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

// --- Modern Multer Setup for images only (memory storage) ---
const imageStorage = multer.memoryStorage();

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB image limit
});

export default uploadImage;

// --- Cloudinary stream uploader for image only ---
export const uploadImageToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const options = {
            folder: "bcf_images",
            allowed_formats: ["jpg", "png", "jpeg"],
            resource_type: "image",
        };

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
