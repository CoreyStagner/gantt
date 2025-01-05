"use server"

import { signOut } from "./authConfig";

const handleSignOut = async () => {
  try {
    await signOut();
  } catch (e) {
    throw e;
  }
}

export {
  handleSignOut
}