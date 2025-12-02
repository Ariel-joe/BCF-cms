import { Router } from "express";
import {
    initiateDonation,
    verifyDonation,
    fetchAllDonations,
} from "../../controllers/donation/donationController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const donationRouter = Router();

donationRouter.post("/donation/initiate", initiateDonation);
donationRouter.get("/donation/verify/:reference", verifyDonation);

// admin route for donation
donationRouter.get("/donations",authMiddleware, fetchAllDonations)

export { donationRouter };
