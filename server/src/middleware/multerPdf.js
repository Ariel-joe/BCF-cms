import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const pdfStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "bcf_documents",
        resource_type: "raw",
        allowed_formats: ["pdf"],
    },
});

const uploadPdf = multer({ storage: pdfStorage });

export default uploadPdf;
