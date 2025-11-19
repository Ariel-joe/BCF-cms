import { hash } from "bcrypt";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const Signup = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { email, password, name, phone } = req.body;

        console.log("req cookies", req.cookies);

        const hashedPassword = await hash(password, 10);
        const userInfo = {
            email,
            password: hashedPassword,
            name,
            phone,
        };

        const newUser = await User.create(userInfo);

        session.commitTransaction();

        // Optional: send a welcoming email to the created acount

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Account created successfully!",
        });
    } catch (error) {
        session.abortTransaction();
        console.error(error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create an account!",
        });
    } finally {
        session.endSession();
    }
};
