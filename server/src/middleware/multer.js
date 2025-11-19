import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage });

export default upload;

// TODO: put it infront of the create blog controller for it to work properly
// upload.single("image");
