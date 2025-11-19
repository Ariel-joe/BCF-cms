import mongoose from "mongoose";
import { User } from "../../database/user.js";
import { Blog } from "../../database/blog.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

// create a blog

export const createBlog = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { image, title, summary, content, tags, pdf } = req.body;

        const userId = req.user.id;
        const user = await User.findOne({ _id: userId }).session(session);

        //TODO: Check the slug for authorization

        // if the user is allowed, he does the following.

        //process image to cloudinary to get the link
        const imageUrl = async () => {
            if (!image) throw new Error("no file found!");
            const result = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
            });

            return result.secure_url;
        };
        //TODO: loop the content, to upload the subtitle and paragraph
        // TODO: also upload the pdf to get the link
        const newBlog = await Blog.create(
            [
                {
                    image: imageUrl,
                    datePublished: Date.now(),
                    title,
                    summary,
                    content,
                    tags,
                    pdf,
                    author: user.name,
                },
            ],
            { session }
        );

        session.commitTransaction();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "blog created successfull",
        });
    } catch (error) {
        session.abortTransaction();
        console.log(error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            messsage: "Please try again!",
        });
    } finally {
        session.endSession();
    }
};
