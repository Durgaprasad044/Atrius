import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

type AuthUser = { id: string; email: string };

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const { id } = req.params;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};