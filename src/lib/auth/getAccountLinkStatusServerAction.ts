"use server";

import { auth } from "@/src/lib/auth/authConfig";
import { pool } from "@/src/lib/postgres";

export const getAccountLinkStatus = async () => {
  // Check if the user is authenticated
  const session = await auth();
  console.log(session);
  if (!session) {
    throw new Error("Unauthorized - No Session Found");
  }
  if (!session.user) {
    throw new Error("Unauthorized = No User found");
  }
  // TODO: Fix the interface for below. in my case I do have a key id directly on the session.
  const uuid: string = session.user.id || session.id || "";

  // Sanitize input
  const uuidRegExp: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
    throw new Error(`Invalid UUID for ${JSON.stringify(session)}`);
  }

  // Check if the user has a Google account linked
  try {
    const result = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM accounts WHERE provider = 'google' AND \"userId\" = $1)",
      [uuid]
    );

    if (!result.rows[0].exists) {
      return false;
    }
  } catch (error) {
    console.error("Failed to check if user has Google account linked:", error);
  }

  return true;
};