import https from "https";

/**
 * Initialize Paystack Transaction (No Axios)
 */
export const initializePaystackTransaction = ({
    email,
    amount,
    firstName,
    lastName,
}) => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email,
            amount,
            currency: "KES",
            first_name: firstName,
            last_name: lastName,
            metadata: {
                first_name: firstName,
                last_name: lastName,
                custom_fields: [
                    {
                        display_name: "Full Name",
                        variable_name: "full_name",
                        value: `${firstName} ${lastName}`,
                    },
                ],
            },
            callback_url: `${process.env.FRONTEND_URL}/donation/success`,
        });

        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (error) {
                    reject(
                        new Error(
                            "Failed to parse Paystack initialization response"
                        )
                    );
                }
            });
        });

        req.on("error", (err) => reject(err));

        req.write(postData);
        req.end();
    });
};

/**
 * Helper function to make the request to Paystack's Verify API.
 */
export const verifyPaystackTransaction = (reference) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: `/transaction/verify/${reference}`, // Verify endpoint uses the reference
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject(
                        new Error(
                            "Failed to parse Paystack verification response"
                        )
                    );
                }
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.end();
    });
};
