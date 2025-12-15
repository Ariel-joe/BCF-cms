import express from "express";
import "dotenv/config";
import { connectDb } from "./database/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import compression from "compression";
import session from "express-session";
import MongoStore from "connect-mongo";
// import passport from "./controllers/Auth/passport-google.js";
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

// TODO: uncompress the server later
// app.use(compression())
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

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 24 * 60 * 60, // 1 day
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        },
    })
);

// // Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

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

// // Passport Google OAuth routes
// app.get(
//     "/auth/google",
//     passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//     "/auth/google/callback",
//     passport.authenticate("google", {
//         failureRedirect: "/auth/signin?error=oauth",
//         successRedirect: "/",
//     })
// );

app.get("/", (req, res) => {
    res.json({
        message: "welcome to BCF CMS API",
    });
});

app.listen(process.env.PORT, () => {
    console.log("server running on port " + process.env.PORT);
});
