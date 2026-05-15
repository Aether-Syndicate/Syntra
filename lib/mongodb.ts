import mongoose from "mongoose";

export const connectDB = async () => {
  // 1. If already connected, don't do it again
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  // 2. HARDCODED BYPASS (No environment variables, no throw errors)
  // PASTE YOUR ACTUAL MONGODB ATLAS CONNECTION STRING HERE:
  const uri = "mongodb+srv://aanapandey00_db_user:slDcjzEhLzofSPEP@cluster0.3jkkmva.mongodb.net/"; 
  
  try {
    await mongoose.connect(uri);
    console.log("🔥 DB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ DB CONNECTION FAILED:", error);
  }
};