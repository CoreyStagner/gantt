"use server";

import { auth } from "@/src/lib/auth/authConfig";
import { pool } from "@/src/lib/postgres";

// Deletes the user's Google account record from the database
export const unlinkGoogleAccount = async () => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!session.user) {
    throw new Error("User not found");
  }
  
  // TODO: Fix the interface for below. in my case I do have a key id directly on the session.
  const uuid: string = session.user.id || session.id || "";

  // Sanitize input
  const uuidRegExp: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
    throw new Error(`Invalid UUID for ${session}`);
  }

  // Remove the Google account from the database
  try {
    await pool.query(
      "DELETE FROM accounts WHERE provider = 'google' AND \"userId\" = $1",
      [uuid]
    );
    return true;
  } catch (error) {
    console.error("Failed to unlink Google account:", error);
  }
};
