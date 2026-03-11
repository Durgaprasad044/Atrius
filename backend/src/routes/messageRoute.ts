import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { sendMessage, getConversation, getConversationList } from "../controllers/messageController";

const router = Router();

router.use(authMiddleware);

// GET /api/messages — list of all conversations
router.get("/", getConversationList);

// GET /api/messages/:userId — conversation with a specific user
router.get("/:userId", getConversation);

// POST /api/messages/:userId — send message to a user
router.post("/:userId", sendMessage);

export default router;