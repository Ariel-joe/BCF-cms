import { model, Schema } from "mongoose";

const welfareSchema = new Schema(
    {
        image: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        category: {
            type: String,
            enum: ["Internal", "FOB"],
            default: "FOB",
            required: true,
        },
        progress: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
            required: true,
        },
        budget: { type: String, required: true },
        successRate: { type: String, default: "0" },
        impactRecord: {
            individuals: { type: String, required: true, trim: true },
            communities: { type: String, required: true, trim: true },
        },
        coordinator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        partners: [{ type: String }],
        summary: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const Welfare = new model("welfare", welfareSchema);

export { Welfare };
