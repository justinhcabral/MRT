import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["SUPER_ADMIN", "STATION_MANAGER"],
    },
    image: { type: String },
    station: {
      type: String, 
      enum:[]
    }
  },
  { timestamps: true }
);

// Explicitly target the 'admins' collection
export const Admin =
  mongoose.models?.Admin || mongoose.model("Admin", AdminSchema, "admins");
