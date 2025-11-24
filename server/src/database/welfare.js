import { model, Schema } from "mongoose";

const welfareSchema = new Schema(
    {
        image: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        category: {
            type: String,
            enum: ["internal", "friends-of-beacon"], // Match frontend values
            required: true,
        },
        progress: { type: String, default: "0%" },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
        budget: { type: String, default: "N/A" },
        successRate: { type: String, default: "0%" },
        impactRecord: {
            individuals: { type: String, default: "0" },
            communities: { type: String, default: "0" },
        },
        coordinator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        partners: [{ type: String, required: true }],
        summary: { type: String, required: true, trim: true },
        content: [
            {
                subtitle: { type: String, required: true },
                paragraphs: [{ type: String, required: true }],
            },
        ], // ✅ Changed from String to Array
    },
    { timestamps: true }
);

const Welfare = model("Welfare", welfareSchema);
export { Welfare };
