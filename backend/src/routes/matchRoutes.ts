import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getMatches } from "../controllers/matchController";

const router = Router();

// All routes protected
router.use(authMiddleware);

// GET /api/matches
router.get("/", getMatches);

export default router;
