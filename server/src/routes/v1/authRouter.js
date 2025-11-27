import { Router } from "express";
import { Signup } from "../../controllers/Auth/Signup.js";
import { login } from "../../controllers/Auth/login.js";
import { forgotPassword } from "../../controllers/Auth/forgot-pass.js";
import { resetPassword } from "../../controllers/Auth/reset-Pass.js";
import { logout } from "../../controllers/Auth/logout.js";

const authRouter = Router();

authRouter.post("/auth/signup", Signup);
authRouter.post("/auth/login", login);
authRouter.post("/auth/logout", logout)
authRouter.post("/auth/forgot-pass", forgotPassword);
authRouter.post("/auth/reset-pass", resetPassword)

export { authRouter };
