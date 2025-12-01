// handle all the donation logic including the authorization to paystach.
import {
    initializePaystackTransaction,
    verifyPaystackTransaction,
} from "../../scripts/paystackHelper.js";

export const initiateDonation = async (req, res) => {
    try {
        const { email, amount, phone } = req.body;

        // 1. Validate Input
        if (!email || !amount) {
            return res.status(400).json({
                success: false,
                message: "Email and Amount are required",
            });
        }

        // 2. Prepare Paystack Payload
        // Note: ensure 'amount' is in kobo (cents) if not already handled by frontend.
        const params = {
            email,
            amount: amount.toString(), // Paystack expects string or integer
            // Pass extra data to Paystack via metadata
            metadata: {
                phone,
                custom_fields: [
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: phone,
                    },
                ],
            },
        };

        // 3. Request Access Code from Paystack
        const response = await initializePaystackTransaction(params);

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

            console.log("Verified Transaction Data:", transactionData);

            return res.status(200).json({
                success: true,
                message: "Transaction successfully verified and completed.",
                data: transactionData,
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
