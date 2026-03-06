import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const getAllEvents = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        organizer: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { attendees: true },
        },
      },
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, description, date, location } = req.body;

    if (!title || !date) {
      res.status(400).json({ message: "Title and date are required" });
      return;
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || "",
        date: new Date(date),
        location: location || "",
        organizerId: userId,
      },
      include: {
        organizer: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: { id: true, name: true, image: true },
        },
        attendees: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const eventId = req.params.id;
    const { title, description, date, location } = req.body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    if (event.organizerId !== userId) {
      res.status(403).json({ message: "Not authorized to update this event" });
      return;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(location !== undefined && { location }),
      },
      include: {
        organizer: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    if (event.organizerId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this event" });
      return;
    }

    await prisma.event.delete({ where: { id: eventId } });

    res.json({ message: "Event deleted" });
  } catch (error) {
    next(error);
  }
};

export const attendEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const existingAttendee = await prisma.eventAttendee.findFirst({
      where: { eventId, userId },
    });

    const profile = await prisma.profile.findUnique({ where: { userId } });

    if (existingAttendee) {
      // Unattend
      await prisma.eventAttendee.delete({ where: { id: existingAttendee.id } });

      if (profile) {
        await prisma.stats.updateMany({
          where: { profileId: profile.id },
          data: { eventsAttended: { decrement: 1 } },
        });
      }

      res.json({ message: "Unattended event", attending: false });
    } else {
      // Attend
      await prisma.eventAttendee.create({
        data: { eventId, userId },
      });

      if (profile) {
        await prisma.stats.updateMany({
          where: { profileId: profile.id },
          data: { eventsAttended: { increment: 1 } },
        });
      }

      res.json({ message: "Attending event", attending: true });
    }
  } catch (error) {
    next(error);
  }
};
