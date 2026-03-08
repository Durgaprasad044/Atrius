import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { prisma } from "./lib/prisma";
import { Prisma } from "@prisma/client";
import { errorMiddleware } from "./middleware/errorMiddleware";

import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import postRoutes from "./routes/postRoutes";
import eventRoutes from "./routes/eventRoutes";
import matchRoutes from "./routes/matchRoutes";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Session (required for passport OAuth state verification)
app.use(session({
  secret: process.env.JWT_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000, // 10 minutes, only needed during OAuth handshake
  },
}));

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const newUser = await tx.user.create({
              data: {
                name: profile.displayName || email.split("@")[0],
                email,
                googleId: profile.id,
                image: profile.photos?.[0]?.value || null,
              },
            });

            const userProfile = await tx.profile.create({
              data: {
                userId: newUser.id,
                title: "",
                location: "",
                company: "",
                education: "",
                bio: "",
                avatarInitials: (profile.displayName || email)
                  .substring(0, 2)
                  .toUpperCase(),
                website: "",
              },
            });

            await tx.stats.create({
              data: {
                profileId: userProfile.id,
                connections: 0,
                smartMatches: 0,
                eventsAttended: 0,
                postsShared: 0,
              },
            });

            return newUser;
          });
        } else if (!user.googleId) {
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId: profile.id,
              image: profile.photos?.[0]?.value || user.image,
            },
          });
        }

        done(null, { id: user.id, email: user.email });
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/matches", matchRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error middleware (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});