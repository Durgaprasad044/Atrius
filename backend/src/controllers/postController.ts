import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getAllPosts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Post content is required" });
      return;
    }

    const post = await prisma.post.create({
      data: {
        userId,
        content,
        likes: 0,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Update postsShared stat
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (profile) {
      await prisma.stats.updateMany({
        where: { profileId: profile.id },
        data: { postsShared: { increment: 1 } },
      });
    }

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id;
    const { content } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post.userId !== userId) {
      res.status(403).json({ message: "Not authorized to update this post" });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (post.userId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this post" });
      return;
    }

    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};
