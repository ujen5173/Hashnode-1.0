import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotAuthenticatedProfileDropdown = React.forwardRef<HTMLDivElement>(
  ({}, ref) => {
    return (
      <div
        ref={ref}
        className="absolute right-0 top-full z-20 mt-1 w-64 rounded-lg border border-border-light bg-gray-50 p-4 text-left shadow-md dark:border-border dark:bg-primary"
      >
        <Image
          src={"/default_user.avif"}
          alt={"Guest User"}
          width={100}
          height={100}
          className="mx-auto mb-4 h-20 w-20 rounded-full"
          draggable={false}
        />

        <h1 className="mb-2 text-left text-xl font-semibold text-gray-700 dark:text-text-secondary">
          Sign up or log in to your Hashnode account.
        </h1>

        <p className="mb-2 text-sm text-gray-500 dark:text-text-primary">
          Takes less than a few seconds.
        </p>

        <div className="flex items-center gap-2">
          <Link href="/onboard" className="w-full">
            <button className="btn-filled w-full">Sign up</button>
          </Link>

          <Link href="/onboard" className="w-full">
            <button className="btn-outline w-full">Log in</button>
          </Link>
        </div>
      </div>
    );
  }
);

NotAuthenticatedProfileDropdown.displayName = "NotAuthenticatedProfileDropdown";

export default NotAuthenticatedProfileDropdown;
