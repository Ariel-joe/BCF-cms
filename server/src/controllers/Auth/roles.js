import { StatusCodes } from "http-status-codes";
import { Role } from "../../database/role.js";

export const fetchRoles = async (req, res) => {
    try {
        const roles = await Role.find();

        const resData = roles.map((role) => ({
            id: role._id,
            name: role.displayName,
            slug: role.slug,
        }));

        res.status(StatusCodes.OK).json({
            success: true,
            data: resData,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An internal server error occurred",
        });
    }
};
