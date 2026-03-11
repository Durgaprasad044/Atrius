import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";

const router = Router();

router.use(authMiddleware);

// GET /api/notifications
router.get("/", getNotifications);

// PUT /api/notifications/read-all
router.put("/read-all", markAllAsRead);

// PUT /api/notifications/:id/read
router.put("/:id/read", markAsRead);

export default router;