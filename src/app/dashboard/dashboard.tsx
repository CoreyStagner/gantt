"use client";

import { SignOutButton } from "@/src/components/signout-button";
import { getAccountLinkStatus } from "@/src/lib/auth/getAccountLinkStatusServerAction";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import { getUserName } from "@/src/lib/auth/getUserNameServerAction";
import { getUserRole } from "@/src/lib/auth/getUserRoleServerAction";
import { unlinkGoogleAccount } from "@/src/lib/auth/unlinkGoogleAccountServerAction";
import { handleSendEmail } from "@/src/lib/email/sendEmailServerAction";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const DashboardPage: React.FC = () => {
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { update } = useSession();

  useEffect(() => {
    const userInfo = async () => {
      const name = await getUserName();
      if (name) {
        setUsername(name);
      }

      const role = await getUserRole();
      if (role) {
        setRole(role);
      }
    };
    const accountLinkStatus = async () => {
      try {
        const accountLinkStatus = await getAccountLinkStatus();
        setIsAccountLinked(accountLinkStatus);
      } catch (error) {
        console.error(error);
      }
    };
    userInfo();
    accountLinkStatus();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <div className="dashboard-card">
        {role === "ADMIN" && (
          <a href="/admin">Go to Admin Page</a>
        )}
        <div>
          <p>Role: {role}</p>
        </div>
        <div className="name">{username}</div>
        <div className="field-input-container">
          <input
            className="field-input"
            type="text"
            placeholder={"Enter name"}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button
            className="update-field-button"
            onClick={() => update({ name: username })}
          >
            Update Name
          </button>
        </div>
        <div>
          <button
            className="link-account-button"
            onClick={
              isAccountLinked
                ? async () => {
                    await unlinkGoogleAccount().then(() => {
                      setIsAccountLinked(false);
                    });
                  }
                : async () => {
                    await handleGoogleSignIn().then(() => {
                      setIsAccountLinked(true);
                    });
                  }
            }
          >
            {isAccountLinked
              ? "Disconnect Google Account"
              : "Connect Google Account"}
          </button>
        </div>
        <SignOutButton className="signout-button" />
        <button onClick={() => handleSendEmail()}>Send Email</button>
      </div>
    </div>
  );
};

export default DashboardPage;
