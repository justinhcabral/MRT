"use server";

import { signIn, signOut } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admins";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signUpSchema } from "@/types/zodtypes";

export type AuthState = {
  error?: string;
  success?: boolean;
  role?: "SUPER_ADMIN" | "STATION_MANAGER";
};

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = formData.get("email") as string;

    // Sign in the user
    await signIn("credentials", { 
      email,
      password: formData.get("password"),
      redirect: false,
    });

    // Fetch the user's role from the database after successful sign-in
    await connectToDB();
    const admin = await Admin.findOne({ email }).select("role").lean();

    if (!admin) {
      return { error: "User not found" };
    }

    return {
      success: true,
      role: admin.role as "SUPER_ADMIN" | "STATION_MANAGER",
    };
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
    // Parse and validate input
    const result = signUpSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      role: formData.get("role"),
    });

    if (!result.success) {
      // Return first validation error
      const firstError = result.error.issues[0];
      return { error: firstError.message };
    }

    const { name, email, password, role } = result.data;

    await connectToDB();

    // Check if admin already exists (case-insensitive)
    const existingAdmin = await Admin.findOne({ email }).lean();
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
    console.error("[Auth] Sign-up error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
