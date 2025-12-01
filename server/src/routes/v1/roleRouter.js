import { Router } from "express";
import { fetchRoles } from "../../controllers/Auth/roles.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const roleRouter = Router()

roleRouter.get("/role",authMiddleware, fetchRoles)

export { roleRouter };