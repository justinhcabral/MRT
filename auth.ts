import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectToDB();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );

        if (passwordsMatch) {
          // return the object that you want to be the "user" in the token
          return { id: user._id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
});
