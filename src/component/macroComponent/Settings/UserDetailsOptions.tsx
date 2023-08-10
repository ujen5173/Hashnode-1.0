import Link from "next/link";
import {
  Code,
  Magic,
  Mail,
  Settings,
  Tab,
  User,
} from "~/svgs";

const UserDetailsOptions = () => {
  return (
    <div className="rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <ul className="py-2">
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border flex items-center gap-2">
          <span>
            <User className="w-4 h-4 fill-gray-500 dark:fill-text-primary" />
          </span>
          <span>
            PROFILE
          </span>
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border flex items-center gap-2">
          <span>
            <Mail className="w-4 h-4 fill-gray-500 dark:fill-text-primary" />
          </span>
          <span>
            EMAIL NOTIFICATIONS
          </span>
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border flex items-center gap-2">
          <span>
            <Tab className="w-4 h-4 fill-gray-500 dark:fill-text-primary" />
          </span>
          <span>
            MANAGE BLOGS
          </span>
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border flex items-center gap-2">
          <span>
            <Code className="w-4 h-4 stroke-gray-500 dark:stroke-text-primary" />
          </span>
          <span>
            DEVELOPER
          </span>
        </li>
        <li className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border flex items-center gap-2">
          <span>
            <Settings className="w-4 h-4 fill-gray-500 dark:fill-text-primary" />
          </span>
          <span>
            ACCOUNT
          </span>
        </li>
        <li>
          <Link href="/settings/pro">
            <div
              className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-light-bg dark:text-text-primary dark:hover:bg-border flex items-center gap-2">
              <span>
                <Magic className="w-4 h-4 fill-gray-500 dark:fill-text-primary" />
              </span>
              <span>
                PRO SUBSCRIPTIONS
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserDetailsOptions;
