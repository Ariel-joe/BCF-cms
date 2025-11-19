import { model, Schema } from "mongoose";

const tokenSchema = new Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, expires: 900, default: Date.now },
});

const Token = new model("token", tokenSchema);

export { Token };
