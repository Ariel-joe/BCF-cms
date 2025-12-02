import { model, Schema } from "mongoose";

const donationSchema = new Schema(
    {
        reference: { type: String, required: true, unique: true },
        status: { type: String, required: true },
        amount: { type: Number, required: true },
        method: { type: String, required: true },
        email: { type: String, required: true },
        fullName: { type: String, required: true },
        paidAt: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

const Donation = model("Donation", donationSchema);

export { Donation };
