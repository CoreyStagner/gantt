"use server"

import { signIn } from "./authConfig";

const handleEmailSignIn = async (data) => {
  try {
    await signIn("nodemailer", { callbackUrl: '/dashboard'})
  } catch (e) {
    throw e;
  }
}

export {
  handleEmailSignIn
}