import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { Admin } from "@/models/Admins";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import { loginSchema } from "@/types/zodtypes";

// Constant-time comparison helper
const DUMMY_HASH =
  "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5jtRvvvdHa1Zm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Early validation before any I/O
        const result = loginSchema.safeParse(credentials);
        if (!result.success) return null;

        const { email, password } = result.data;

        try {
          await connectToDB();

          // Use select() to only fetch needed fields + lean() for plain object
          const admin = await Admin.findOne({ email })
            .select("_id name email password role image")
            .lean()
            .exec();

          // Timing-safe: always hash comparison regardless of user existence
          const passwordHash = admin?.password ?? DUMMY_HASH;
          const isValidPassword = await bcrypt.compare(password, passwordHash);

          // Reject if admin doesn't exist OR password mismatch
          if (!admin || !isValidPassword) return null;

          // Return user object for JWT
          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
            image: admin.image ?? null,
          };
        } catch (error) {
          // Log for debugging but don't expose details to client
          console.error("[Auth] Authorize failed:", error);
          return null;
        }
      },
    }),
  ],
});

export default auth;
