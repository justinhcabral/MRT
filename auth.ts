import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { Admin } from "@/models/Admins";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectToDB();

        const admin = await Admin.findOne({ email: credentials?.email });
        if (!admin) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials?.password as string,
          admin.password
        );

        if (passwordsMatch) {
          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
            image: admin.image,
          };
        }
        return null;
      },
    }),
  ],
});

// Export auth as proxy for Next.js 16+
export { auth as default } from "@/auth";
