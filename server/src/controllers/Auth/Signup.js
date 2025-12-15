import { hash } from "bcrypt";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../database/role.js";

export const Signup = async (req, res) => {
    try {
        const { email, password, name, phone, role, isActive } = req.body;

        // Validate role exists
        const userRole = await Role.findById(role);
        if (!userRole) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid role specified",
            });
        }

        // Check if role is already assigned
        const existingUser = await User.findOne({ role: userRole.slug });
        if (existingUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Role is already assigned to another user",
            });
        }

        const hashedPassword = await hash(password, 10);

        const userInfo = {
            email,
            password: hashedPassword,
            name,
            phone,
            role: userRole.slug,
            isActive,
        };

        await User.create(userInfo);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Account created successfully!",
        });
    } catch (error) {
        console.error("Signup Error:", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create an account!",
        });
    }
};
