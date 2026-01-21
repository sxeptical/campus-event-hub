import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Organiser" },
  name: { type: String, required: true },
  studentId: { type: String },
  school: { type: String },
  year: { type: String },
  phone: { type: String },
  bio: { type: String },
});

export default mongoose.model("User", userSchema);
