import { Router } from "express";
import { fetchRoles } from "../../controllers/Auth/roles.js";

const roleRouter = Router()

roleRouter.get("/role", fetchRoles)

export { roleRouter };