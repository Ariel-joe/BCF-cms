import { Router } from "express";
import {
    initiateDonation,
    verifyDonation,
    fetchAllDonations,
} from "../../controllers/donation/donationController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { permissionLoader } from "../../middleware/permissionMiddleware.js";
import { checkPermission } from "../../middleware/rbacMiddleware.js";

const donationRouter = Router();

donationRouter.post("/donation/initiate", initiateDonation);
donationRouter.get("/donation/verify/:reference", verifyDonation);

// admin route for donation
donationRouter.get(
    "/donations",
    authMiddleware,
    permissionLoader,
    checkPermission("finance:read"), // only users with finance:read can access
    fetchAllDonations
);

export { donationRouter };
