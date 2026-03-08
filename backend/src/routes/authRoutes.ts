import { Router } from "express";
import passport from "passport";
import { register, login, googleCallback } from "../controllers/authController";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /api/auth/google/callback
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        console.error("Passport error:", err);
        return res.status(500).json({ message: "OAuth error", error: err.message });
      }
      if (!user) {
        console.error("No user returned from passport:", info);
        return res.status(401).json({ message: "OAuth failed", info });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

// GET /api/auth/failure
router.get("/failure", (_req, res) => {
  res.status(401).json({ message: "Google OAuth failed" });
});

export default router;