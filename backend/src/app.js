import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();

// 1. Define CORS ONCE with all required properties
app.use(
  cors({
    origin: "https://v-connect-frontend-t3lx.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// 2. Define Body Parsers ONCE
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// 3. Define server configuration & sockets
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

// 4. API Routes
app.use("/api/v1/users", userRoutes);

// 5. Database & Server initialization
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://baaditya284_db_user:oUMPi7CIcv6bkAWK@cluster0.1gddngt.mongodb.net/",
    );
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`LISTENING ON PORT ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Database connection error: ", error);
  }
};

start();
