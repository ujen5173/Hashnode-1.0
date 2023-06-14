import { type User } from "@prisma/client";
import Link from "next/link";
import React, { type FC } from "react";

const UserDetails: FC<{ userDetails: User | undefined }> = ({
  userDetails,
}) => {
  return (
    <div className="my-6 flex w-full flex-wrap gap-6 rounded-md py-6">
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1.5rem)]">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          About Me
        </h1>
        {userDetails?.bio ? (
          <p className="text-base text-gray-700 dark:text-text-secondary">
            {userDetails?.bio}
          </p>
        ) : (
          <div className="py-8 text-center">
            <span className="text-gray-500 dark:text-text-primary">
              No bio to display
            </span>
          </div>
        )}
      </div>
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1.5rem)]">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          My Tech Stack
        </h1>
        {userDetails?.skills && userDetails?.skills.length > 0 ? (
          userDetails?.skills?.map((tech, index) => (
            <div className="flex flex-wrap gap-2" key={index}>
              <Link href={"/tag/" + tech.toLowerCase()}>
                <span className="block rounded-md border border-border-light bg-light-bg px-3 py-1 text-base text-gray-700 hover:shadow-sm dark:border-border dark:bg-primary-light dark:text-text-secondary">
                  {tech}
                </span>
              </Link>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <span className="text-gray-500 dark:text-text-primary">
              No tech stack to display
            </span>
          </div>
        )}
      </div>
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1.5rem)]">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          I am available for
        </h1>
        {userDetails?.bio ? (
          <p className="text-base text-gray-700 dark:text-text-secondary">
            {userDetails?.bio}
          </p>
        ) : (
          <div className="py-8 text-center">
            <span className="text-gray-500 dark:text-text-primary">
              Nothing to show
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
