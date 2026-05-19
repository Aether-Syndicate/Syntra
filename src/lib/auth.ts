// src/lib/auth.ts
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  // Use JSON Web Tokens for secure session storage
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days session validity
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials.");
        }

        await connectDB();

        // 1. Locate the User Profile
        const user = await User.findOne({ 
          email: credentials.email.toLowerCase()
        }).select("+password");

        if (!user) {
          throw new Error("No Digital Twin mapped to this email.");
        }

        // 2. Validate Secure Password Encryption
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        // 3. Pass Authorized Data to the JWT Lifecycle
        // FIXED: Explicitly mapping the nested gamification streak to the root return object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatarId: user.avatarId,
          streak: user.gamification?.currentStreak ?? 0, 
        };
      }
    })
  ],
  callbacks: {
    // Save structural fields from the authorize return statement into the encrypted JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatarId = (user as any).avatarId;
        token.streak = (user as any).streak; // Now correctly grabs the value!
      }
      return token;
    },
    // Expose those token details so Khwaish can read them on the client via useSession()
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).avatarId = token.avatarId;
        (session.user as any).streak = token.streak;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", 
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Helper function to securely fetch the current user's session on the server.
 * Your frontend team can import this directly into their layout/pages.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}