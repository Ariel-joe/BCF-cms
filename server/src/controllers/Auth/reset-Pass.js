import mongoose from "mongoose";
import { Token } from "../../database/token.js";
import { hash } from "bcrypt";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";

export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        // TODO: check on the error during reset password, test the token feature(getting the latest token instead of any)
        const confirmToken = await Token.findOne({ token }).sort({
            createdAt: -1,
        });
        if (!confirmToken || confirmToken.token !== token)
            throw new Error("Please try again!");

        // lookup user and token within the session
        const user = await User.findOne({ email: confirmToken.email });
        if (!user) throw new Error("Invalid!, please try again");

        const hashedPassword = await hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        await confirmToken.deleteOne();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Password updated successfully!",
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || "Failed to reset password",
        });
    }
};
