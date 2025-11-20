import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bcf_images",
        allowed_formats: ["jpg", "png", "jpeg"],
        limits: { fileSize: 2 * 1024 * 1024 },
    },
});
const uploadImage = multer({ storage: imageStorage });

export default uploadImage;

// TODO: put it infront of the create blog controller for it to work properly
// upload.single("image");
