import { NextAuthOptions, getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [], // Add your NextAuth providers here
};

/**
 * Helper function to securely fetch the current user's session on the server.
 * Your frontend team can import this directly into their layout/pages.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}