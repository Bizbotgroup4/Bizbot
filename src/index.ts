import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

import router from "./routes/routes";
import { initializeTwilio } from "./controllers/chatbot";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI ?? "")
  .then(async () => {
    console.log("MongoDB connected!");
    await initializeTwilio();

    app.get("/", async (req, res) => res.send("Yay! App is running."));

    app.use(router);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.log("MongoDB connection error: ", error.message);
  });
