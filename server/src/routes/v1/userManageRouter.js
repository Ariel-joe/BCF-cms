import { Router } from "express";
import {
    activateUser,
    deactivateUser,
    deleteUser,
    getUserProfile,
    listAccounts,
    updateUserDetails,
} from "../../controllers/user-management/userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";

const userManageRouter = Router();

// List all accounts - requires 'user:read'
userManageRouter.get(
    "/account",
    authMiddleware,
    permissionLoader,
    checkPermission("user:read"),
    listAccounts
);

// Get single user profile - requires ALL 'user:read', 'user:update', 'user:delete'
userManageRouter.get(
    "/account/:id",
    authMiddleware,
    permissionLoader,
    checkPermission(["user:read", "user:update", "user:delete"], "AND"),
    getUserProfile
);

// Update user details - requires 'user:update'
userManageRouter.put(
    "/account/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("user:update"),
    updateUserDetails
);

// Delete user - requires 'user:delete'
userManageRouter.delete(
    "/account/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("user:delete"),
    deleteUser
);

// Activate user - requires 'user:update'
userManageRouter.put(
    "/account/activate/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("user:update"),
    activateUser
);

// Deactivate user - requires 'user:update'
userManageRouter.put(
    "/account/deactivate/:id",
    authMiddleware,
    permissionLoader,
    checkPermission("user:update"),
    deactivateUser
);

export { userManageRouter };
