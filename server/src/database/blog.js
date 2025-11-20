import { model, Schema } from "mongoose";

const blogSchema = new Schema(
    {
        image: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        datePublished: { type: Date, required: true, default: Date.now },
        title: { type: String, required: true, trim: true },
        summary: { type: String, required: true, trim: true },
        content: [
            {
                subtitle: { type: String, required: true, trim: true },
                paragraph: { type: String, required: true, trim: true },
            },
        ],
        tags: [{ type: String, required: true }],
        pdf: {
            title: { type: String, trim: true },
            url: { type: String },
        },
    },
    { timestamps: true }
);

const Blog = new model("blog", blogSchema);

export { Blog };
