import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide a name"] },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: { type: String, required: true, select: false }, // Store HASHED passwords only, select false for mongoose to avoid including password in queries
    role: {
      type: String,
      default: "user",
    },
    image: { type: String },
    status: { type: String },
    enum: ["ACTIVE", "SUSPENDED", "PENDING_VERIFICATION"],
  },
  { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
