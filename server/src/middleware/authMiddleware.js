// TODO: auth middleware for protecting routes

import jwt from "jsonwebtoken";
import { User } from "../database/user.js";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies[process.env.AUTH_COOKIE_NAME];

        if (!token) throw new Error("token not found");

        // verify payload
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = payload;

        const user = await User.findById(id);
        if (!user) throw new Error("Invalid credentials");

        req.user = user;

        next();
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized",
        });
    }
};
