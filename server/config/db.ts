import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose
 * Requires MONGODB_URI environment variable to be set
 */
export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI environment variable is not set. Please set it in your .env file to enable authentication and saved recipes features."
      );
    }

    await mongoose.connect(mongoUri);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error(
      "✗ MongoDB connection error. Authentication features will not work without MongoDB.",
      error
    );
    throw error;
  }
}
