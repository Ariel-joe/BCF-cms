import { hash } from "bcrypt";
import { User } from "../../database/user.js";
import { StatusCodes } from "http-status-codes";
import { Role } from "../../database/role.js";

export const Signup = async (req, res) => {
    try {
        const { email, password, name, phone, role, isActive } = req.body;

        console.log("req cookies", req.cookies);

        const hashedPassword = await hash(password, 10);

        const userRole = await Role.findById(role);
        if (!userRole) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid role specified",
            });
        }
        const userInfo = {
            email,
            password: hashedPassword,
            name,
            phone,
            role: userRole.slug,
            isActive
        };

        const newUser = await User.create(userInfo);

        // Optional: send a welcoming email to the created acount

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Account created successfully!",
        });
    } catch (error) {
        console.error(error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create an account!",
        });
    }
};
