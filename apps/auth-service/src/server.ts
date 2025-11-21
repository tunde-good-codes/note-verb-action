import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors"
import helmet from "helmet"
import connectDb from "./utils/db";
import { corsOptions, errorHandler, healthCheck } from "../../../shared/middleware";
import router from "./routes/auth.router";



const app = express();

connectDb();

//app.use(errorMiddleware);

app.use(cookieParser());
app.use(cors(corsOptions()));
app.use(helmet())




// parse JSON bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/auth", router);
app.get("/health", healthCheck);

// Error handling middleware
app.use(errorHandler);
// Your routes here

//app.use("/api", router);

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to auth-service!!" });
});


// Add this endpoint
app.get("/auth", (req, res) => {
  res.json({
    message: "Auth service is working via gateway!",
    success: true,
    timestamp: new Date().toISOString(),
  });
});

// Keep your existing root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "auth-service is here",
    success: true,
  });
});
// Error middleware MUST be last
//app.use(errorMiddleware);

const PORT = process.env.AUTH_SERVICE_PORT || 8081;
const server = app.listen(PORT, () => {
  console.log(`Auth Service listening at http://localhost:${PORT}/api`);
  console.log(`Swagger Service listening at http://localhost:${PORT}/docs`);
});


server.on("error", console.error);
