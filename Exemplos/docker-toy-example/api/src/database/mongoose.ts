import mongoose from "mongoose";
import { env } from "../config/env";

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log("MongoDB connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not connect to MongoDB: ${message}`);
    throw error;
  }
};