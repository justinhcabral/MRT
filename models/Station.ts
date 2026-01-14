import mongoose from "mongoose";

const StationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a station name"],
      unique: true,
    },
    line: {
      type: String,
      required: true,
      enum: ["MRT-3"], // Restrict to known lines
    },
    // CRITICAL: This matches your JSON structure exactly
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers: [Longitude, Latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "UNDER_MAINTENANCE"],
      default: "ACTIVE",
    },
    qrCode: {
      type: String,
      unique: true,
    },
    assignedManagers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
  },
  { timestamps: true }
);

// Add a 2dsphere index for geo queries
StationSchema.index({ location: "2dsphere" });

// Check if model exists to prevent "OverwriteModelError" in Next.js hot-reloading
const Station =
  mongoose.models.Station || mongoose.model("Station", StationSchema);

export default Station;
