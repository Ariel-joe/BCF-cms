import { compare } from "bcrypt";
import { User } from "../../database/user.js";
import jwt from "jsonwebtoken"
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const login = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { email, password } = req.body;
        // do final checks for the email here.
        const user = await User.findOne({ email }).session(session);
        console.log("user", user);

        if (!user) throw new Error("Invalid Credentials");
        // do a password check
        const passwordMatch = await compare(password, user.password);
        console.log("passwordMatch", passwordMatch);

        if (!passwordMatch) throw new Error("Invalid credentials");

        const jwtInfo = { id: user.id };
        const token = jwt.sign(jwtInfo, process.env.JWT_SECRET, {
            expiresIn: 24 * 60 * 60,
        });

        res.cookie(process.env.AUTH_COOKIE_NAME, token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "strict" | "lax" | "none" (secure must be true)
            // domain: "",
            path: "/",
        });

        console.log("res cookies", res.cookie);

        const resData = {
            name: user.name,
            email: user.email,
            phone: user?.phone,
        };

        session.commitTransaction();

        return res.status(StatusCodes.OK).json({
            success: true,
            data: resData,
        });
    } catch (error) {
        session.abortTransaction();
        console.error(error);

        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid credentials, please try again",
        });
    } finally {
        session.endSession();
    }
};


//TODO: google authentication.
