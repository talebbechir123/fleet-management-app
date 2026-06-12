import mongoose from "mongoose";
import { app } from "./app.js";
import { config } from "./config.js";

async function start(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
}

start();