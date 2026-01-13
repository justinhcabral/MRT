"use server";

import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import Wallet from "@/models/Wallet";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";

export async function registerUser(formData: FormData) {
  await connectToDB();

  /* 
    1. Start a session for transaction safety
    2. Create user
    3. Create wallet immediately, linked to that user
    4. Commit: Save both or save neither
    5. Rollback: undo everything if error
    */

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const password = formData.get("password");

    if (!password || typeof password !== "string") {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      [
        {
          name: formData.get("name"),
          email: formData.get("email"),
          password: hashedPassword,
        },
      ],
      { session }
    );

    await Wallet.create(
      [
        {
          userId: newUser[0]._id,
          balance: 0,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return { error: "Registration failed" };
  } finally {
    session.endSession();
  }
}
