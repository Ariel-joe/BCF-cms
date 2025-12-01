import https from "https";

export const initializePaystackTransaction = (params) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    // Parse the JSON response from Paystack
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error("Failed to parse Paystack response"));
                }
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        // Write the parameters to the request body
        req.write(JSON.stringify(params));
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
