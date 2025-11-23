import { StatusCodes } from "http-status-codes";

export const authorize = (requiredPermission) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const userPermissions = req.user.permissions || [];

            if (!userPermissions.includes(requiredPermission)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: "Forbidden: Insufficient permissions",
                });
            }

            next();
        } catch (error) {
            console.error("Authorization Error:", error.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
};
// TODO: put it infront of any route for permission