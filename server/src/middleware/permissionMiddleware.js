import { StatusCodes } from "http-status-codes";
import { AuthSlug } from "../database/authSlug.js";

export const permissionLoader = async (req, res, next) => {
    try {
        if (!req.user) throw new Error("unauthorized!");

        const userRoles = req.user.roles || [];

        const rolesDocs = await AuthSlug.find({ slug: { $in: userRoles } });

        const permissionsSet = new Set();

        // Merge permissions from all roles
        rolesDocs.forEach((role) => {
            role.permissions.forEach((perm) => permissionsSet.add(perm));
        });

        // Optional: direct user permissions
        if (req.user.permissions) {
            req.user.permissions.forEach((p) => permissionsSet.add(p));
        }

        req.user.permissions = Array.from(permissionsSet);

        next();
    } catch (error) {
        console.error("Permission Loader Error:", error.message);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
// TODO: put it infront of any route for permission
