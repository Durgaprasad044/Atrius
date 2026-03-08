import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

type AuthUser = { id: string; email: string };

export const getMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as AuthUser).id;

    // Get current user's profile with skills and interests
    const myProfile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: true,
        interests: true,
      },
    });

    if (!myProfile) {
      res.json([]);
      return;
    }

    const mySkillNames = myProfile.skills.map((s) => s.name.toLowerCase());
    const myInterestNames = myProfile.interests.map((i) => i.name.toLowerCase());

    // Get all other users with their profiles
    const otherUsers = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: {
        id: true,
        name: true,
        image: true,
        profile: {
          include: {
            skills: true,
            interests: true,
          },
        },
      },
    });

    // Score each user based on shared skills and interests
    const scored = otherUsers
      .filter((u) => u.profile)
      .map((u) => {
        const theirSkills = u.profile!.skills.map((s) => s.name.toLowerCase());
        const theirInterests = u.profile!.interests.map((i) => i.name.toLowerCase());

        const sharedSkills = mySkillNames.filter((s) => theirSkills.includes(s));
        const sharedInterests = myInterestNames.filter((i) => theirInterests.includes(i));

        // Score: 60% weight on skills, 40% on interests
        const totalPossible = Math.max(mySkillNames.length + myInterestNames.length, 1);
        const matchPoints = sharedSkills.length * 0.6 + sharedInterests.length * 0.4;
        const score = Math.min(Math.round((matchPoints / totalPossible) * 100 + 10), 99);

        return {
          id: `${userId}-${u.id}`,
          score,
          status: "suggested",
          sharedSkills,
          sharedInterests,
          matchedUser: {
            id: u.id,
            name: u.name,
            image: u.image,
            profile: {
              title: u.profile!.title,
              location: u.profile!.location,
              company: u.profile!.company,
              avatarInitials: u.profile!.avatarInitials,
            },
          },
        };
      })
      .sort((a, b) => b.score - a.score);

    res.json(scored);
  } catch (error) {
    next(error);
  }
};