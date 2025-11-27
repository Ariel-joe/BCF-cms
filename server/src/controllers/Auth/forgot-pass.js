import { StatusCodes } from "http-status-codes";
import { TokenGenerator } from "../../scripts/tokenGeneration.js";
import { User } from "../../database/user.js";
import { Resend } from "resend";
import { resetpassTemplate } from "../../templates/reset-pass-temp.js";
import mongoose from "mongoose";
import { Token } from "../../database/token.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const forgotPassword = async (req, res) => {
    try {
        session.startTransaction();
        const { email } = req.body;

        const confirmEmail = await User.findOne({ email });
        if (!confirmEmail) throw new Error("Please try again.");

        const token = await TokenGenerator();

        // find tokens that have been created for this email and delete them
        await Token.deleteMany({ email });

        // create a new token entry

        const newToken = await Token.create({ email, token });

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${newToken.token}`;
        // send the email with the reset code or link
        const { data, error } = await resend.emails.send({
            from: "Password Reset <support@arieljoe.me>",
            to: email,
            subject: "Password Reset!",
            html: resetpassTemplate(resetLink),
        });

        if (error) throw new Error(error);

        res.status(StatusCodes.OK).json({
            success: true,
            data: "reset token sent successfully!",
        });
    } catch (error) {
        console.log(error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            messsage: "Please try again!",
        });
    }
};
