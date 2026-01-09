import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    image: { type: String },
  },
  { timestamps: true }
);

// Explicitly target the 'admins' collection
export const Admin =
  mongoose.models?.Admin || mongoose.model("Admin", AdminSchema, "admins");
