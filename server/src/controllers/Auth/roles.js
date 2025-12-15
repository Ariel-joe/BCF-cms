import { StatusCodes } from "http-status-codes";
import { Role } from "../../database/role.js";
import { User } from "../../database/user.js";

export const fetchRoles = async (req, res) => {
    try {
        // Get all roles
        const roles = await Role.find();

        // Get all users and their roles
        const users = await User.find({}, "role"); // only fetch the 'role' field

        const assignedRoles = new Set(users.map((user) => user.role));

        // Filter roles that are not assigned
        const unassignedRoles = roles
            .filter((role) => !assignedRoles.has(role.slug))
            .map((role) => ({
                id: role._id,
                name: role.displayName,
                slug: role.slug,
            }));

        res.status(StatusCodes.OK).json({
            success: true,
            data: unassignedRoles,
        });
    } catch (error) {
        console.error("Fetch Unassigned Roles Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An internal server error occurred",
        });
    }
};
