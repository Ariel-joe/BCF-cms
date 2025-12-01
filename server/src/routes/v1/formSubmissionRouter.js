import { Router } from "express";
import {
    getAllFormSubmissions,
    getFormSubmissionById,
    submitContactForm,
} from "../../controllers/contactForm/contactFormController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const formSubmissionRouter = Router();

formSubmissionRouter.post("/form/create", submitContactForm);
formSubmissionRouter.get("/form", authMiddleware,getAllFormSubmissions);
formSubmissionRouter.get("/form/:id", authMiddleware,getFormSubmissionById);

export { formSubmissionRouter };
