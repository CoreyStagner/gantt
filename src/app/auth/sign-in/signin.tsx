"use client";

import { FcGoogle } from "react-icons/fc";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import { useState, useTransition } from "react";
import { handleEmailSignIn } from "@/src/lib/auth/emailSignInServerAction";

const SignInPage: React.FC = () => {
  // Local Variables
  const [isPending, startTransition] = useTransition();
  const [emailSignInFormData, setEmailSignInFormData] = useState({
    email: "" as string,
  });
  const allowedSignInTypes = ["email", "google"];

  // Local Functions
  /**
   * This function is to handle the form submission for email sign in so that we pass through the handleEmailSignIn logic from the server.
   *
   * @param event {React.FormEvent} Event object
   * @returns {Promise<void>}
   */
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      startTransition(async () => {
        await handleEmailSignIn(emailSignInFormData);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Returned JSX for the SignInPage component
  return (
    <div className="page_signin">
      <div className="signin-card">
        <h2>Sign In</h2>
        <div className="form-container">
          {/* Check to see if we allow email sign in */}
          {allowedSignInTypes.includes("email") && (
            <>
              <form onSubmit={handleFormSubmit} className="email-signin-form">
                <input
                  type="email"
                  className="form-input"
                  maxLength={320}
                  placeholder="Email Address"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmailSignInFormData({ email: e.target.value });
                  }}
                  disabled={isPending}
                  required
                />
                <button type="submit" className="submit-button">
                  Sign in with email
                </button>
              </form>
              <div className="divider">
                <div className="line"></div>
                <span className="or">OR</span>
                <div className="line"></div>
              </div>
            </>
          )}
          <div className="social-logins">
            {/* Check to see if we allow sign in through Google OAUTH API */}
            {allowedSignInTypes.includes("google") && (
              <button className="google" onClick={handleGoogleSignIn}>
                <FcGoogle className="google-icon" />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
