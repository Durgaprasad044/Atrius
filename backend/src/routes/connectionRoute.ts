import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getConnections,
  getPendingRequests,
  getConnectionStatus,
} from "../controllers/connectionController";

const router = Router();

router.use(authMiddleware);

// GET /api/connections — all accepted connections
router.get("/", getConnections);

// GET /api/connections/pending — incoming requests
router.get("/pending", getPendingRequests);

// GET /api/connections/status/:targetId — check status with a user
router.get("/status/:targetId", getConnectionStatus);

// POST /api/connections/request/:userId — send request
router.post("/request/:userId", sendRequest);

// POST /api/connections/accept/:connectionId — accept request
router.post("/accept/:connectionId", acceptRequest);

// POST /api/connections/reject/:connectionId — reject request
router.post("/reject/:connectionId", rejectRequest);

export default router;