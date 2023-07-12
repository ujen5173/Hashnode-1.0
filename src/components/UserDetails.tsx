import Link from "next/link";
import { type FC } from "react";
import { type UserDetailsInterface } from "~/pages/u/[username]";

const UserDetails: FC<{
  userDetails: UserDetailsInterface | undefined;
}> = ({ userDetails }) => {
  return (
    <div className="my-6 flex w-full flex-wrap gap-6 rounded-md py-6">
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1rem)]">
        <h1 className="mb-4 text-lg font-semibold text-gray-700 dark:text-text-secondary md:text-xl lg:text-2xl">
          About Me
        </h1>
        {userDetails?.bio ? (
          <p className="text-sm text-gray-500 dark:text-text-primary md:text-base">
            {userDetails?.bio}
          </p>
        ) : (
          <div className="py-8 text-center">
            <span className="text-sm text-gray-500 dark:text-text-primary md:text-base">
              No bio to display
            </span>
          </div>
        )}
      </div>
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1rem)]">
        <h1 className="mb-4 text-lg font-semibold text-gray-700 dark:text-text-secondary md:text-xl lg:text-2xl">
          My Tech Stack
        </h1>
        {userDetails?.skills && userDetails?.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {userDetails?.skills?.map((tech, index) => (
              <Link
                target={"_blank"}
                href={"/tag/" + tech.toLowerCase()}
                key={index}
              >
                <span className="block rounded-md border border-border-light bg-light-bg px-3 py-1 text-sm text-gray-700 hover:shadow-sm dark:border-border dark:bg-primary-light dark:text-text-secondary md:text-base">
                  {tech}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <span className="text-sm text-gray-500 dark:text-text-primary md:text-base">
              No tech stack to display
            </span>
          </div>
        )}
      </div>
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1rem)]">
        <h1 className="mb-4 text-lg font-semibold text-gray-700 dark:text-text-secondary md:text-xl lg:text-2xl">
          I am available for
        </h1>
        {userDetails?.bio ? (
          <p className="text-sm text-gray-500 dark:text-text-primary md:text-base">
            {userDetails?.bio}
          </p>
        ) : (
          <div className="py-8 text-center">
            <span className="text-sm text-gray-500 dark:text-text-primary md:text-base">
              Nothing to show
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
