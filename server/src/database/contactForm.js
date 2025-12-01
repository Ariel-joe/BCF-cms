import { Schema, model } from "mongoose";

const contactFormSchema = new Schema(
    {
        FName: { type: String, required: true },
        LName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        newsletter: { type: Boolean, required: true },
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const ContactForm = model("ContactForm", contactFormSchema);

export { ContactForm };
