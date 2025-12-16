import { Router } from "express";
import { Signup } from "../../controllers/Auth/Signup.js";
import { login } from "../../controllers/Auth/login.js";
import { forgotPassword } from "../../controllers/Auth/forgot-pass.js";
import { resetPassword } from "../../controllers/Auth/reset-Pass.js";
import { logout } from "../../controllers/Auth/logout.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";

const authRouter = Router();

// Only users with "user:create" can make a signup (create account)
authRouter.post(
    "/auth/signup",
    // authMiddleware,
    // permissionLoader,
    // checkPermission("user:create"),
    Signup
);

// Public routes
authRouter.post("/auth/login", login);
authRouter.post("/auth/logout", logout);
authRouter.post("/auth/forgot-pass", authMiddleware, permissionLoader, checkPermission("user:edit"), forgotPassword);
authRouter.post("/auth/reset-pass/:token", resetPassword);

export { authRouter };
