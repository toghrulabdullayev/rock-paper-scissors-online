import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

import { app, server } from "./util/socket.js";
import router from "./routes/route.js";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1", router);
app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong." });
});

try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected!");

  server.listen(3000);
} catch (error) {
  throw new Error(error);
}
