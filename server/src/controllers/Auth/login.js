import { compare } from "bcrypt";
import { User } from "../../database/user.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });

        // 2. Check if user exists
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials", // Generic message for security
            });
        }

        // 3. Check password
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 4. Create Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d", // readable string format
        });

        // 5. Set Cookie
        const cookieOptions = {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        };

        res.cookie(process.env.AUTH_COOKIE_NAME, token, cookieOptions);

        // 6. Send Success Response
        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                phone: user?.phone,
                role: user?.role, // Useful to send role to frontend if you have it
            },
        });
    } catch (error) {
        console.error("Login System Error:", error);

        // 500 is better for unexpected server errors (like DB disconnected)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An internal server error occurred",
        });
    }
};
