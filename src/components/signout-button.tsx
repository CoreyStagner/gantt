"use client";

import { useRouter } from "next/navigation";
import { handleSignOut } from "../lib/auth/signOutServerAction";

export const SignOutButton = (props: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <button
      className={props.className}
      style={{ cursor: "pointer" }}
      onClick={() => handleSignOut()}
    >
      {props.children || "Sign Out"}
    </button>
  );
};
