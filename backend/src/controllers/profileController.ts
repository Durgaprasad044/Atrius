import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

type AuthUser = { id: string; email: string };

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: true,
        interests: true,
        stats: true,
      },
    });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true },
    });

    res.json({ ...profile, user });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const { name, title, location, company, education, bio, website, avatarInitials } = req.body;

    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(title !== undefined && { title }),
        ...(location !== undefined && { location }),
        ...(company !== undefined && { company }),
        ...(education !== undefined && { education }),
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
        ...(avatarInitials !== undefined && { avatarInitials }),
      },
      include: {
        skills: true,
        interests: true,
        stats: true,
      },
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUserId = (req.user as AuthUser).id;
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } }, // exclude self
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profile: {
          select: {
            title: true,
            location: true,
            company: true,
            avatarInitials: true,
            skills: { select: { name: true } },
          },
        },
      },
      take: 20, // limit results
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profile: {
          include: {
            skills: true,
            interests: true,
            stats: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Skill name is required" });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id as string,
        name,
      },
    });

    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

export const removeSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const skillId = req.params.id as string;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const skill = await prisma.skill.findUnique({ where: { id: skillId as string } });
    if (!skill || skill.profileId !== profile.id) {
      res.status(403).json({ message: "Not authorized to delete this skill" });
      return;
    }

    await prisma.skill.delete({ where: { id: skillId as string } });

    res.json({ message: "Skill removed" });
  } catch (error) {
    next(error);
  }
};

export const addInterest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Interest name is required" });
      return;
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const interest = await prisma.interest.create({
      data: {
        profileId: profile.id as string,
        name,
      },
    });

    res.status(201).json(interest);
  } catch (error) {
    next(error);
  }
};

export const removeInterest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;
    const interestId = req.params.id as string;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const interest = await prisma.interest.findUnique({ where: { id: interestId as string } });
    if (!interest || interest.profileId !== profile.id) {
      res.status(403).json({ message: "Not authorized to delete this interest" });
      return;
    }

    await prisma.interest.delete({ where: { id: interestId as string } });

    res.json({ message: "Interest removed" });
  } catch (error) {
    next(error);
  }
};