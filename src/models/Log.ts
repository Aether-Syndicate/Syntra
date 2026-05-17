//src/models/Log.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface ILog extends Document {
  userId: string;
  date: Date;
  domain: string;
  domainData: Record<string, any>; // Flexible object to catch whatever sliders Khwaish builds
}

const LogSchema = new Schema<ILog>(
  {
    userId: { type: String, required: true, index: true }, // index: true makes finding logs for the Dashboard lightning fast
    date: { type: Date, default: Date.now },
    domain: { type: String, required: true },
    domainData: { type: Schema.Types.Mixed, required: true } // Schema.Types.Mixed allows diverse JSON shapes
  },
  { timestamps: true }
);

const Log = models.Log || mongoose.model<ILog>("Log", LogSchema);

export default Log;