import express from "express"
import "dotenv/config"
import { connectDb } from "./database/config.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./controllers/Auth/passport-google.js";
import { authRouter } from "./routes/v1/authRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();

// TODO: uncompress the server later
// app.use(compression())

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

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/v1", authRouter);

// Passport Google OAuth routes
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/signin?error=oauth",
        successRedirect: "/",
    })
);

app.get("/", authMiddleware,(req, res) => {
    res.json({
        message: "Dear all, I'm back!",
    });
});


app.listen(8080, () => {
    console.log("server running on port 8080")
})