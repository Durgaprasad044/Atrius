import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getMyProfile,
  updateMyProfile,
  addSkill,
  removeSkill,
  addInterest,
  removeInterest,
} from "../controllers/profileController";

const router = Router();

// All routes protected
router.use(authMiddleware);

// GET /api/profile/me
router.get("/me", getMyProfile);

// PUT /api/profile/me
router.put("/me", updateMyProfile);

// POST /api/profile/me/skills
router.post("/me/skills", addSkill);

// DELETE /api/profile/me/skills/:id
router.delete("/me/skills/:id", removeSkill);

// POST /api/profile/me/interests
router.post("/me/interests", addInterest);

// DELETE /api/profile/me/interests/:id
router.delete("/me/interests/:id", removeInterest);

export default router;
