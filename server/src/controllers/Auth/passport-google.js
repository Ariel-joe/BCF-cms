import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../database/user.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.DOMAIN}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;

                const update = {
                    $set: {
                        name,
                        email,
                        googleId,
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                    },
                };

                const options = {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                };

                const user = await User.findOneAndUpdate(
                    { googleId },
                    update,
                    options
                ).exec();
                return cb(null, user);
            } catch (err) {
                return cb(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
