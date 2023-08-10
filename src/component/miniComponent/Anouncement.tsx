import Link from "next/link";
import { Rocket } from "~/svgs";

const Anouncement = () => {
  return (
    <div className="anouncement rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
      <header className="mb-2 flex gap-4">
        <span className="mt-2">
          <Rocket className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
        </span>
        <span className="text-xl font-bold text-black dark:text-white">
          Introducing Hahsnode Pro
        </span>
      </header>

      <p className="mb-5 text-sm text-gray-700 dark:text-text-secondary sm:text-base">
        Level up your publishing experience with Hahsnode Pro with powerful AI
        and premium features.
      </p>

      <div className="flex flex-col gap-2">
        <Link href="/settings/pro">
          <button
            role="button"
            aria-label="upgrade plan"
            className="btn-tertiary w-fit"
          >
            Upgrade now
          </button>
        </Link>
        <button
          role="button"
          aria-label="lean more on Hashnode pro"
          className="btn-outline w-fit text-sm text-white"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default Anouncement;
