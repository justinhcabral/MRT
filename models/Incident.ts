import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    stationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
      required: true,
    },
    title: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "CRITICAL"],
    },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default IncidentSchema;
