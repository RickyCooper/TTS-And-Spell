import mongoose from "mongoose";
import { config } from "../config";

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");
};
