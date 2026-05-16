import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  // Back to using the secure environment variable!
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  try {
    await mongoose.connect(uri);
    console.log("🔥 DB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ DB CONNECTION FAILED:", error);
  }
};