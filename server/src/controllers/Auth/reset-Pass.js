import mongoose from "mongoose";
import { Token } from "../../database/token.js";
import { hash } from "bcrypt";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";

export const resetPassword = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { email, password, token } = req.body;

        // lookup user and token within the session
        const user = await User.findOne({ email }).session(session);
        if (!user) throw new Error("Invalid!, please try again");

        // TODO: check on the error during reset password, test the token feature(getting the latest token instead of any)
        const confirmToken = await Token.findOne({ email })
            .sort({ createdAt: -1 })
            .session(session);
        if (!confirmToken || confirmToken.token !== token)
            throw new Error("Please try again!");

        const hashedPassword = await hash(password, 10);
        user.password = hashedPassword;
        await user.save({ session });

        await confirmToken.deleteOne({ session });
        await session.commitTransaction();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Password updated successfully!",
        });
    } catch (error) {
        session.abortTransaction();

        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message || "Failed to reset password",
        });
    } finally {
        session.endSession();
    }
};
