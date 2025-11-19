import { StatusCodes } from "http-status-codes";
import { TokenGenerator } from "../../scripts/tokenGeneration.js";
import { User } from "../../database/user.js";
import { Resend } from "resend";
import { resetpassTemplate } from "../../templates/reset-pass-temp.js";
import mongoose from "mongoose";
import { Token } from "../../database/token.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const forgotPassword = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { email } = req.body;

        const confirmEmail = await User.findOne({ email }).session(session);
        if (!confirmEmail) throw new Error("Please try again.");

        const token = await TokenGenerator();

        const newToken = await Token.create([{ email, token }], { session });

        // send the email with the reset code or link
        const { data, error } = await resend.emails.send({
            from: "Password Reset <support@arieljoe.me>",
            to: email,
            subject: "Password Reset!",
            html: resetpassTemplate(token),
        });

        if (error) throw new Error(error);

        session.commitTransaction();

        res.status(StatusCodes.OK).json({
            success: true,
            data: "reset token sent successfully!",
        });
    } catch (error) {
        session.abortTransaction();
        console.log(error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            messsage: "Please try again!",
        });
    } finally {
        session.endSession();
    }
};