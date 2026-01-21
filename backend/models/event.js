import mongoose from "mongoose";
import user from "./user.js";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organiser: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  slotsAvailable: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v <= this.totalSlots;
      },
      message: "Slots available cannot be more than total slots",
    },
  },
  totalSlots: {
    type: Number,
    required: true,
    max: [500, "Total slots cannot exceed 500"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Event", eventSchema);
