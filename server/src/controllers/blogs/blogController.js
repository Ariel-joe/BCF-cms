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

        const { title, summary, content, tags, pdfTitle } = req.body;

        const userId = req.user.id;
        const user = await User.findOne({ _id: userId }).session(session);

        //TODO: Check the slug for authorization

        // if the user is allowed, he does the following.
        const imageUrl =
            req.files?.image && req.files.image.length > 0
                ? req.files.image[0].path
                : null;

        const pdfUrl =
            req.files?.pdf && req.files.pdf.length > 0
                ? req.files.pdf[0].path
                : null;
        //TODO: loop the content, to upload the subtitle and paragraph
        // TODO: also upload the pdf to get the link
        const newBlog = await Blog.create(
            [
                {
                    image: imageUrl,
                    datePublished: Date.now(),
                    title,
                    summary,
                    content: content.map((item) => ({
                        subtitle: item.subtitle,
                        paragraph: item.paragraph,
                    })),
                    tags: tags.map((item) => item),
                    pdf: {
                        title: pdfTitle,
                        url: pdfUrl,
                    },
                    author: user.name,
                },
            ],
            { session }
        );

        if (!newBlog) throw new Error("cannot create the blog!");
        

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
