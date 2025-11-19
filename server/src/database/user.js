import { model, Schema } from "mongoose";

// TODO: use the virtual schema for the image.
const userSchema = new Schema(
    {
        googleId: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
    },
    {
        timestamps: true,
    }
);

const User = model("user", userSchema);

export { User };
