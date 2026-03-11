import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

type AuthUser = { id: string; email: string };

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = (req.user as AuthUser).id;
    const { userId: receiverId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      res.status(400).json({ message: "Message content is required" });
      return;
    }

    const message = await prisma.message.create({
      data: { senderId, receiverId, content: content.trim() },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true } });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "MESSAGE",
        message: `New message from ${sender?.name}`,
        referenceId: message.id,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const { userId: otherId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: otherId, receiverId: userId, read: false },
      data: { read: true },
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getConversationList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    // Get all messages involving current user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    // Get unique conversations with latest message
    const conversationMap = new Map();
    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(otherId)) {
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
        const unreadCount = await prisma.message.count({
          where: { senderId: otherId, receiverId: userId, read: false },
        });
        conversationMap.set(otherId, {
          userId: otherId,
          user: otherUser,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount,
        });
      }
    }

    res.json(Array.from(conversationMap.values()));
  } catch (error) {
    next(error);
  }
};