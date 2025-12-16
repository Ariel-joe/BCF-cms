import express from "express";
import "dotenv/config";
import { connectDb } from "./database/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/v1/authRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { blogRouter } from "./routes/v1/blogRouter.js";
import { welfRouter } from "./routes/v1/welfareRouter.js";
import { profileRouter } from "./routes/v1/profileRouter.js";
import { userManageRouter } from "./routes/v1/userManageRouter.js";
import { roleRouter } from "./routes/v1/roleRouter.js";
import { formSubmissionRouter } from "./routes/v1/formSubmissionRouter.js";
import { donationRouter } from "./routes/v1/donationsRouter.js";

const app = express();

app.set("trust proxy", 1);


app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: [process.env.CLIENT_URL, process.env.WEBSITE_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));

// db connection
connectDb();

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());




// public routers
app.use("/api/v1", donationRouter);

// routes
app.use(
    "/api/v1",
    authRouter,
    formSubmissionRouter,
    blogRouter,
    welfRouter,
    profileRouter,
    authMiddleware,
    userManageRouter,
    roleRouter
);


app.get("/", (req, res) => {
    res.json({
        message: "welcome to BCF CMS API",
    });
});

app.listen(process.env.PORT, () => {
    console.log("server running on port " + process.env.PORT);
});
