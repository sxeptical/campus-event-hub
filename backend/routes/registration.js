import express from "express";
import Registration from "../models/registration.js";
import Event from "../models/event.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const session = await Registration.startSession();
  session.startTransaction();
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      throw new Error("userId and eventId are required");
    }

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.slotsAvailable <= 0) {
      throw new Error("Event is fully booked");
    }

    // Check query using new field names
    const existing = await Registration.findOne({
      userId: userId,
      eventId: eventId,
    }).session(session);
    if (existing) {
      throw new Error("User already registered for this event");
    }

    // Create registration with denormalized event data
    const newRegistration = new Registration({
      userId: userId,
      eventId: eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      eventImage: event.image || "",
      registeredAt: new Date(),
    });

    await newRegistration.save({ session });

    // Decrement slots
    event.slotsAvailable -= 1;
    await event.save({ session });

    await session.commitTransaction();
    res.status(201).json(newRegistration);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId, eventId } = req.query;
    console.log("GET /registrations query:", req.query);
    const filter = {};
    if (userId) filter.userId = userId;
    if (eventId) filter.eventId = eventId;

    // No need to populate event details since they are now stored directly in registration
    const registrations = await Registration.find(filter).populate(
      "userId",
      "name email",
    );

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const session = await Registration.startSession();
  session.startTransaction();
  try {
    const registration = await Registration.findById(req.params.id).session(
      session,
    );
    if (!registration) {
      throw new Error("Registration not found");
    }

    const eventId = registration.eventId;
    await Registration.findByIdAndDelete(req.params.id).session(session);

    // Increment slots backing
    const event = await Event.findById(eventId).session(session);
    if (event) {
      event.slotsAvailable += 1;
      await event.save({ session });
    }

    await session.commitTransaction();
    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
