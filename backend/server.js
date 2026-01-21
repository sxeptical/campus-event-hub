import express from "express";
import cors from "cors";
const app = express();
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import events from "./routes/event.js";
import users from "./routes/user.js";
import registrations from "./routes/registration.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Enables CORS so your front-end can access your backend API without browser blocking it.
app.use(cors());
// Allows Express to parse JSON data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/events", events);
app.use("/users", users);
app.use("/registrations", registrations);

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Campus Event Hub API",
      version: "1.0.0",
      description: "API documentation for the Campus Event Hub backend",
    },
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

// Generate Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);
// use app.use to mount swagger ui to /api-docs:
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Initial route to test if your backend server is running properly
app.get("/", async (req, res) => {
  res.send("<h1>Welcome to my API! The server is running successfully.</h1>");
});
// Set port
const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
