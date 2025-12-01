import { Router } from "express";
import {
    initiateDonation,
    verifyDonation,
} from "../../controllers/donation/donationController.js";

const donationRouter = Router();

donationRouter.post("/donation/initiate", initiateDonation);
donationRouter.get("/donation/verify/:reference", verifyDonation);

export { donationRouter };
