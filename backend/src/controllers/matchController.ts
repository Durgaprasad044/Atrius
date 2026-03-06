import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const matches = await prisma.match.findMany({
      where: { userId },
      orderBy: { score: "desc" },
      include: {
        matchedUser: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: {
              select: {
                title: true,
                location: true,
                company: true,
                avatarInitials: true,
              },
            },
          },
        },
      },
    });

    res.json(matches);
  } catch (error) {
    next(error);
  }
};
