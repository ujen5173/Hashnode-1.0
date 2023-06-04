import { signIn } from "next-auth/react";
import React, { useContext } from "react";
import { C, type ContextValue } from "~/utils/context";

const AuthCheck = () => {
  const { user } = useContext(C) as ContextValue;

  return (
    <div className="border-b border-border-light bg-light-bg p-4 text-center text-gray-700 dark:border-border dark:bg-primary dark:text-text-secondary">
      {!!user ? (
        <span className="font-semibold text-green">
          {user.user.name + " is logged in"}
        </span>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-semibold text-red">NOT LOGGED IN</p>
          <div className="flex items-center gap-2">
            <button
              className="btn-filled"
              onClick={() =>
                void signIn("github", {
                  callbackUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
                })
              }
            >
              Continue with Github
            </button>
            <button
              className="btn-outline"
              onClick={() => void signIn("google")}
            >
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthCheck;