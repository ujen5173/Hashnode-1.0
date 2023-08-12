
import { useSession } from 'next-auth/react';

const Account = () => {
  const { data: session } = useSession();

  return (
    <>
      <h1 className="text-2xl font-semibold text-red mb-4">Delete account</h1>
      <p className="text-lg text-gray-700 dark:text-text-secondary mb-2">
        Your Hashnode Clone account administers these blogs: <span className="font-medium"> {session?.user.handle?.handle}.hashnode-t3.dev</span>
      </p>
      <p className="text-lg text-gray-700 dark:text-text-secondary mb-6">
        Your personal data will be deleted permanently when you delete your account on Hashnode Clone. This action is irreversible.
      </p>

      <button className="px-4 py-2 rounded-md bg-red hover:bg-[#f10707] text-white shadow-md outline-none font-medium text-sm">
        Delete your account
      </button>
    </>
  )
}

export default Account;