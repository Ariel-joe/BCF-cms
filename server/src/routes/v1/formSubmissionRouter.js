import { Router } from "express";
import {
    getAllFormSubmissions,
    getFormSubmissionById,
    submitContactForm,
} from "../../controllers/contactForm/contactFormController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";

const formSubmissionRouter = Router();

// Public route
formSubmissionRouter.post("/form/create", submitContactForm);

// Admin routes
formSubmissionRouter.get(
    "/form",
    authMiddleware,
    permissionLoader,
    checkPermission(["contact:read"], "AND"),
    getAllFormSubmissions
);

formSubmissionRouter.get(
    "/form/:id",
    authMiddleware,
    permissionLoader,
    checkPermission(["contact:read"], "AND"),
    getFormSubmissionById
);

export { formSubmissionRouter };
