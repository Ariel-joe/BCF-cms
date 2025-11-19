import { model, Schema } from "mongoose";

const bioDataSchema = new Schema(
    {
        image: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        slug: { type: String, enum: ["both", "team", "board"], required: true },
        description: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    }
);

const BioData = model("bio", bioDataSchema);

export { BioData };
