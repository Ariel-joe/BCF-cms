import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        googleId: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        role: [{ type: String }],
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

export { User };
