import express from "express";
import Event from "../models/event.js";

// Create a router instance
const router = express.Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event
 *     responses:
 *       200:
 *         description: Event created successfully
 */
// POST /events -> Create a new events
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve all events
 *     description: Returns a list of all events
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
// GET /events -> Retrieve all events
router.get("/", async (req, res) => {
  try {
    // Fetch all events from the database (or filter by query)
    const events = await Event.find(req.query);
    res.status(200).json(events); // Return events as JSON
  } catch (error) {
    console.error(error);
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     description: Updates an event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
// PUT /events/:id -> Update an event
router.put("/:id", async (req, res) => {
  const session = await Event.startSession();
  session.startTransaction();
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session },
    );

    if (!updatedEvent) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    // Update associated registrations
    const Registration = (await import("../models/registration.js")).default;
    await Registration.updateMany(
      { eventId: req.params.id },
      {
        $set: {
          eventTitle: updatedEvent.title,
          eventDate: updatedEvent.date,
          eventLocation: updatedEvent.location,
          eventImage: updatedEvent.image,
        },
      },
    ).session(session);

    await session.commitTransaction();
    res.json(updatedEvent);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retrieve an event by ID
 *     description: Returns a specific event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 */
// GET /events/:id -> Retrieve an event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 */
// DELETE /events/:id -> Delete an event
router.delete("/:id", async (req, res) => {
  const session = await Event.startSession();
  session.startTransaction();
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id).session(
      session,
    );
    if (!deletedEvent) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete associated registrations
    // Dynamic import to avoid circular dependency issues if any
    const Registration = (await import("../models/registration.js")).default;
    await Registration.deleteMany({ eventId: req.params.id }).session(session);

    await session.commitTransaction();
    res.json({
      message: "Successfully Deleted Event",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
