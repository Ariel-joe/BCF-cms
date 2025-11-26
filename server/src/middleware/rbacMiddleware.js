import { StatusCodes } from "http-status-codes";
import { User } from "../database/user.js";
import { Role } from "../database/role.js";

// /**
//  * Check if user has required permission(s)
//  * @param {string|string[]} requiredPermissions - Single permission or array of permissions
//  * @param {string} logic - 'AND' or 'OR' (default: 'OR')
//  */
export const checkPermission = (requiredPermissions, logic = "OR") => {
    return async (req, res, next) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user.id) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            // Get user with role
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "User not found",
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: "Your account has been deactivated",
                });
            }

            // Get role permissions
            const role = await Role.findOne({ slug: user.role });
            if (!role) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: "Invalid role assigned",
                });
            }

            const userPermissions = role.permissions;

            // Convert single permission to array
            const permissions = Array.isArray(requiredPermissions)
                ? requiredPermissions
                : [requiredPermissions];

            // Check permissions based on logic
            let hasPermission = false;

            if (logic === "AND") {
                // User must have ALL permissions
                hasPermission = permissions.every((perm) =>
                    userPermissions.includes(perm)
                );
            } else {
                // User must have AT LEAST ONE permission
                hasPermission = permissions.some((perm) =>
                    userPermissions.includes(perm)
                );
            }

            if (!hasPermission) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message:
                        "You do not have permission to perform this action",
                    required: permissions,
                });
            }

            // Attach user permissions to request for later use
            req.userPermissions = userPermissions;
            next();
        } catch (error) {
            console.error("RBAC Middleware Error:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Permission check failed",
            });
        }
    };
};


// /**
//  * Check if user has a specific role
//  * @param {string|string[]} allowedRoles - Single role or array of roles
//  */
export const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "User not found",
                });
            }

            const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

            if (!roles.includes(user.role)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: "You do not have the required role",
                });
            }

            next();
        } catch (error) {
            console.error("Role Check Error:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Role check failed",
            });
        }
    };
};