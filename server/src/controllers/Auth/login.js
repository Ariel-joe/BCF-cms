import { compare } from "bcrypt";
import { User } from "../../database/user.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../database/role.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message:
                    "Your account has been deactivated. Please contact an administrator.",
            });
        }

        // update last login date
        user.lastLogin = new Date();
        await user.save();

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Get role details
        const role = await Role.findOne({ slug: user.role });

        // Create Token with role and permissions
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                permissions: role ? role.permissions : [],
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            domain: ".vercel.app"
        };

        res.cookie(process.env.AUTH_COOKIE_NAME, token, cookieOptions);

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                displayName: role ? role.displayName : user.role,
                permissions: role ? role.permissions : [],
            },
        });
    } catch (error) {
        console.error("Login System Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An internal server error occurred",
        });
    }
};
