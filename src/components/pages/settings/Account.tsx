import { useSession } from "next-auth/react";

const Account = () => {
  const { data: session } = useSession();

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold text-red">Delete account</h1>
      <p className="mb-2 text-lg text-gray-700 dark:text-text-secondary">
        Your Hashnode Clone account administers these blogs:{" "}
        <span className="font-medium">
          {" "}
          {session?.user.handle?.handle}.hashnode-t3.dev
        </span>
      </p>
      <p className="mb-6 text-lg text-gray-700 dark:text-text-secondary">
        Your personal data will be deleted permanently when you delete your
        account on Hashnode Clone. This action is irreversible.
      </p>

      <button className="rounded-md bg-red px-4 py-2 text-sm font-medium text-white shadow-md outline-none hover:bg-[#f10707]">
        Delete your account
      </button>
    </>
  );
};

export default Account;
