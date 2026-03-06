import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  attendEvent,
} from "../controllers/eventController";

const router = Router();

// All routes protected
router.use(authMiddleware);

// GET /api/events
router.get("/", getAllEvents);

// POST /api/events
router.post("/", createEvent);

// GET /api/events/:id
router.get("/:id", getEventById);

// PUT /api/events/:id
router.put("/:id", updateEvent);

// DELETE /api/events/:id
router.delete("/:id", deleteEvent);

// POST /api/events/:id/attend
router.post("/:id/attend", attendEvent);

export default router;
