"use server"

import { signIn } from "./authConfig";

const handleGoogleSignIn = async () => {
  try {
    await signIn("google", { redirectTo: '/dashboard'})
  } catch (e) {
    throw e;
  }
}

export {
  handleGoogleSignIn
}