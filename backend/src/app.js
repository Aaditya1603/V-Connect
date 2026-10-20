import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv"; // 1. Import dotenv

// 2. Load environment variables from the .env file
dotenv.config();

const app = express();

// 3. Define CORS ONCE with all required properties
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "https://v-connect-frontend-t3lx.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// 4. Define Body Parsers ONCE
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// 5. Define server configuration & sockets
const server = createServer(app);
const io = connectToSocket(server);

// Fetch the port from the environment variable, defaulting to 8000
app.set("port", process.env.PORT || 8000);

// 6. API Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfully!" });
});

app.use("/api/v1/users", userRoutes);

// 7. Database & Server initialization
const start = async () => {
  try {
    // 8. Dynamic secure connection
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`LISTENING ON PORT ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Database connection error: ", error);
    process.exit(1); // Stop the server if the DB connection fails
  }
};

start();
