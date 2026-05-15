// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Helper function to securely fetch the current user's session on the server.
 * Your frontend team can import this directly into their layout/pages.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}