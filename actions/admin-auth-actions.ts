"use server";

import { signIn, signOut } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admins";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    await connectToDB();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;

    // Validation
    if (!name || !email || !password || !role) {
      return { error: "All fields are required" };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    if (!["SUPER_ADMIN", "STATION_MANAGER"].includes(role)) {
      return { error: "Invalid role selected" };
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return { error: "An account with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
}
