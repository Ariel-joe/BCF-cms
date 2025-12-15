// public route for contact form submissions

import { StatusCodes } from "http-status-codes";
import { ContactForm } from "../../database/contactForm.js";

export const submitContactForm = async (req, res) => {
    try {
        const { FName, LName, email, phone, subject, message, newsletter } =
            req.body;

        // logic hande newsletter for later scaling, when we have a newsletter service integrated
        const formData = {
            FName,
            LName,
            email,
            phone,
            subject,
            message,
            newsletter,
            isRead: false,
        };

        const newContactForm = await ContactForm.create(formData);

        if (!newContactForm) throw new Error("Failed to submit contact form");

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Contact form submitted successfully",
        });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An error occurred while submitting the contact form",
        });
    }
};

// fetch all form submissions with pagination
export const getAllFormSubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [contactForms, totalSubmissions] = await Promise.all([
            ContactForm.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ContactForm.countDocuments()
        ]);

        const totalPages = Math.ceil(totalSubmissions / limit);

        return res.status(StatusCodes.OK).json({
            success: true,
            data: contactForms,
            pagination: {
                currentPage: page,
                totalPages,
                totalSubmissions,
                hasMore: page < totalPages,
                limit
            }
        });
    } catch (error) {
        console.error("Error fetching contact forms:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An error occurred while fetching contact forms",
        });
    }
};

// getsubmission by id

export const getFormSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const contactForm = await ContactForm.findById(id);
        if (!contactForm) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Contact form submission not found",
            });
        }

        // Mark the form submission as read
        contactForm.isRead = true;
        await contactForm.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: contactForm,
        });
    } catch (error) {
        console.error("Error fetching contact form submission:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message:
                "An error occurred while fetching the contact form submission",
        });
    }
};
