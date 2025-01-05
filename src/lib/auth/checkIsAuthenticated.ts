"use server";
import { auth } from "@/src/lib/auth/authConfig";

const checkIsAuthenticated = async () => {
  const session = await auth();
  if (session) {
    return true;
  } else {
    return false;
  }
}

export { checkIsAuthenticated };