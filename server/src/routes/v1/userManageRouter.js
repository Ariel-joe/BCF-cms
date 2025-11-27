import { Router } from "express";
import {
    activateUser,
    deactivateUser,
    deleteUser,
    getUserProfile,
    listUsers,
    updateUserDetails,
} from "../../controllers/user-management/userController.js";

const userManageRouter = Router();

userManageRouter.get("/accounts", listUsers);
userManageRouter.get("/account/:id", getUserProfile);
userManageRouter.put("/account/:id", updateUserDetails);
userManageRouter.delete("/account/:id", deleteUser);
userManageRouter.put("/account/activate/:id", activateUser);
userManageRouter.put("/account/deactivate/:id", deactivateUser);

export { userManageRouter };
