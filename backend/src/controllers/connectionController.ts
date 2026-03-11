import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

type AuthUser = { id: string; email: string };

export const sendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = (req.user as AuthUser).id;
    const { userId: receiverId } = req.params;

    if (senderId === receiverId) {
      res.status(400).json({ message: "Cannot connect with yourself" });
      return;
    }

    const existing = await prisma.connection.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });

    if (existing) {
      res.status(400).json({ message: "Connection request already sent" });
      return;
    }

    const connection = await prisma.connection.create({
      data: { senderId, receiverId, status: "PENDING" },
    });

    const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true } });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "CONNECTION",
        message: `${sender?.name} sent you a connection request`,
        referenceId: connection.id,
      },
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const receiverId = (req.user as AuthUser).id;
    const { connectionId } = req.params;

    const connection = await prisma.connection.findUnique({ where: { id: connectionId } });

    if (!connection || connection.receiverId !== receiverId) {
      res.status(404).json({ message: "Connection request not found" });
      return;
    }

    const updated = await prisma.connection.update({
      where: { id: connectionId },
      data: { status: "ACCEPTED" },
    });

    const receiver = await prisma.user.findUnique({ where: { id: receiverId }, select: { name: true } });

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: connection.senderId,
        type: "CONNECTION",
        message: `${receiver?.name} accepted your connection request`,
        referenceId: connectionId,
      },
    });

    // Increment connections stat for both
    await prisma.$transaction([
      prisma.stats.updateMany({ where: { profile: { userId: receiverId } }, data: { connections: { increment: 1 } } }),
      prisma.stats.updateMany({ where: { profile: { userId: connection.senderId } }, data: { connections: { increment: 1 } } }),
    ]);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const receiverId = (req.user as AuthUser).id;
    const { connectionId } = req.params;

    const connection = await prisma.connection.findUnique({ where: { id: connectionId } });

    if (!connection || connection.receiverId !== receiverId) {
      res.status(404).json({ message: "Connection request not found" });
      return;
    }

    await prisma.connection.update({ where: { id: connectionId }, data: { status: "REJECTED" } });

    res.json({ message: "Connection request rejected" });
  } catch (error) {
    next(error);
  }
};

export const getConnections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { senderId: userId, status: "ACCEPTED" },
          { receiverId: userId, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, image: true, profile: { select: { title: true, company: true, avatarInitials: true } } } },
        receiver: { select: { id: true, name: true, image: true, profile: { select: { title: true, company: true, avatarInitials: true } } } },
      },
    });

    res.json(connections);
  } catch (error) {
    next(error);
  }
};

export const getPendingRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    const pending = await prisma.connection.findMany({
      where: { receiverId: userId, status: "PENDING" },
      include: {
        sender: { select: { id: true, name: true, image: true, profile: { select: { title: true, company: true, avatarInitials: true } } } },
      },
    });

    res.json(pending);
  } catch (error) {
    next(error);
  }
};

export const getConnectionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const { targetId } = req.params;

    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId },
        ],
      },
    });

    res.json({ status: connection?.status || "NONE", connectionId: connection?.id || null, isSender: connection?.senderId === userId });
  } catch (error) {
    next(error);
  }
};