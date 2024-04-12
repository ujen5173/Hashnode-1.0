import { Mail, Settings, Table2, User, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const UserDetailsOptions = () => {
  const { tab } = useRouter().query;

  return (
    <div className="rounded-md border border-border-light bg-white py-2 dark:border-border dark:bg-primary">
      <ul className="scroll-area text-gray-00 mb-2 flex flex-row items-end overflow-auto whitespace-nowrap text-sm font-bold uppercase dark:bg-primary dark:text-text-secondary lg:flex-col lg:items-start">
        <li className="w-full">
          <Link href="/settings">
            <div
              className={`flex cursor-pointer flex-row items-center gap-2 px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border ${tab?.length === 1 && tab[0] === undefined ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}
            >
              <span>
                <User
                  className={`h-5 w-5 ${tab?.length === 1 && tab[0] === undefined ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`}
                />
              </span>
              <span>PROFILE</span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/settings/email-notification">
            <div
              className={`flex cursor-pointer flex-row items-center gap-2 px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border ${tab?.length === 1 && tab[0] === "email-notification" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}
            >
              <span>
                <Mail
                  className={`h-5 w-5 ${tab?.length === 1 && tab[0] === "email-notification" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`}
                />
              </span>
              <span>EMAIL NOTIFICATIONS</span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/settings/manage-blogs">
            <div
              className={`flex cursor-pointer flex-row items-center gap-2 px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border ${tab?.length === 1 && tab[0] === "manage-blogs" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}
            >
              <span>
                <Table2
                  className={`h-5 w-5 ${tab?.length === 1 && tab[0] === "manage-blogs" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`}
                />
              </span>
              <span>MANAGE BLOGS</span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/settings/account">
            <div
              className={`flex cursor-pointer flex-row items-center gap-2 px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border ${tab?.length === 1 && tab[0] === "account" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}
            >
              <span>
                <Settings
                  className={`h-5 w-5 ${tab?.length === 1 && tab[0] === "account" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`}
                />
              </span>
              <span>ACCOUNT</span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/settings/pro">
            <div
              className={`flex cursor-pointer flex-row items-center gap-2 px-4 py-3 text-base font-semibold hover:bg-gray-200 dark:hover:bg-border ${tab?.length === 1 && tab[0] === "pro" ? "text-secondary" : " text-gray-600 dark:text-text-primary"}`}
            >
              <span>
                <Wand2
                  className={`h-5 w-5 ${tab?.length === 1 && tab[0] === "pro" ? "stroke-secondary" : " stroke-gray-600 dark:stroke-text-primary"}`}
                />
              </span>
              <span>PRO SUBSCRIPTIONS</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDetailsOptions;
