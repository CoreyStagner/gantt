"use server";

import { pool } from "@/src/lib/postgres";
import { auth } from "./authConfig";

// Get the role from the postgres database based on the UUID in the users table
export const getUserRole = async () => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  } else {
    // TODO: Fix the interface for below. in my case I do have a key id directly on the session.
    const uuid = (session.user?.id) || session.id || "";

    // Sanitize input
    const uuidRegExp: RegExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
      throw new Error("Invalid UUID");
    }

    const { rows } = await pool.query("SELECT role FROM users WHERE id = $1", [
      uuid,
    ]);
    return rows[0].role;
  }
};