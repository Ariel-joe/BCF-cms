// handle all the donation logic including the authorization to paystach.
import { StatusCodes } from "http-status-codes";
import {
    initializePaystackTransaction,
    verifyPaystackTransaction,
} from "../../scripts/paystackHelper.js";
import { Donation } from "../../database/donation.js";
import { User } from "../../database/user.js";

export const initiateDonation = async (req, res) => {
    try {
        const { email, amount, phone, firstName, lastName } = req.body;

        // 1. Validate Input
        if (!email || !amount || !firstName || !lastName || amount <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, Amount, First Name, and Last Name are required",
            });
        }

        // 3. Request Access Code from Paystack
        const response = await initializePaystackTransaction({
            email,
            amount,
            firstName,
            lastName,
            phone,
        });

        // 4. Check Paystack's Logical Response (status: false means logic error, e.g., invalid key)
        if (!response.status) {
            return res.status(400).json({
                success: false,
                message: response.message || "Failed to initialize transaction",
            });
        }

        // 5. Send Access Code to Frontend
        // The frontend will use data.access_code with inline.js
        return res.status(200).json({
            success: true,
            message: "Transaction initialized",
            data: response.data, // Contains: access_code, authorization_url, reference
        });
    } catch (error) {
        console.error("Paystack Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const verifyDonation = async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "Transaction reference is required for verification.",
            });
        }

        // 1. Call Paystack's Verification API
        const verificationResponse = await verifyPaystackTransaction(reference);

        // 2. Check Paystack response status
        if (!verificationResponse.status) {
            return res.status(400).json({
                success: false,
                message:
                    verificationResponse.message ||
                    "Paystack verification failed.",
            });
        }

        const transactionData = verificationResponse.data;

        // 3. Final status check: Only "success" is valid for confirmation
        if (transactionData.status === "success") {
            // NOTE: This is where you would typically:
            // - Save the transaction details (reference, amount, donor email) to your database.
            // - Send confirmation emails to the donor/admin.

            const donationRecord = {
                reference: transactionData.reference,
                status: transactionData.status,
                amount: transactionData.amount,
                method: transactionData.authorization.channel,
                email: transactionData.customer.email,
                fullName: `${transactionData.metadata.first_name} ${transactionData.metadata.last_name}`,
                paidAt: transactionData.paid_at,
            };

            console.log(
                "Verified Transaction/donation record:",
                donationRecord
            );
            await Donation.create(donationRecord);

            return res.status(200).json({
                success: true,
                message: "Transaction successfully verified and completed.",
                data: donationRecord,
            });
        } else {
            // Payment status is 'abandoned', 'failed', 'pending', etc.
            return res.status(402).json({
                success: false,
                message: `Payment status is not successful: ${transactionData.status}`,
                data: transactionData,
            });
        }
    } catch (error) {
        console.error("Verification Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during verification.",
        });
    }
};

// fetch all donations
export const fetchAllDonations = async (req, res) => {
    try {
        const userId = req.user.id;

        const loggedInUser = await User.findById(userId);

        if (!loggedInUser) throw new Error("unathorized access");

        const donations = await Donation.find().sort({ createdAt: -1 });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Donations fetched successfully",
            data: donations,
        });
    } catch (error) {
        console.error("Fetch Donations Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error while fetching donations.",
        });
    }
};
