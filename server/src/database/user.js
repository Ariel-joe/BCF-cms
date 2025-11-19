import { model, Schema } from "mongoose";

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
