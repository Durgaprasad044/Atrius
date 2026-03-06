import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/postController";

const router = Router();

// All routes protected
router.use(authMiddleware);

// GET /api/posts
router.get("/", getAllPosts);

// POST /api/posts
router.post("/", createPost);

// PUT /api/posts/:id
router.put("/:id", updatePost);

// DELETE /api/posts/:id
router.delete("/:id", deletePost);

// POST /api/posts/:id/like
router.post("/:id/like", likePost);

export default router;
