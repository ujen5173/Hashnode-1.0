import { signIn, useSession } from "next-auth/react";

const AuthCheck = () => {
  const { data: user } = useSession();

  return (
    <div className="border-b border-border-light bg-light-bg p-4 text-center text-gray-700 dark:border-border dark:bg-primary dark:text-text-secondary">
      {!!user ? (
        <span className="font-semibold text-green">
          {user.user.name + " is logged in"}
        </span>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-semibold text-red">NOT LOGGED IN</p>

          <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
            <button
              className="btn-outline w-full sm:w-max"
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
