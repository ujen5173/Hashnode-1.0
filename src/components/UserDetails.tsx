import Link from "next/link";
import React from "react";

const UserDetails = () => {
  return (
    <div className="my-6 flex w-full flex-wrap gap-6 rounded-md py-6">
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1.5rem)]">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          About Me
        </h1>
        <p className="text-base text-gray-700 dark:text-text-secondary">
          My name is Hoh Shen Yien, I&apos;m a Malaysian fullstack developer who
          likes to read and write sometimes 🤩
        </p>
      </div>
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1.5rem)]">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          My Tech Stack
        </h1>
        <div className="flex flex-wrap gap-2">
          {[
            "React",
            "Typescript",
            "Nextjs",
            "Graphql",
            "Tailwindcss",
            "trpc",
          ].map((tech, index) => (
            <Link href={"/tag/" + tech.toLowerCase()} key={index}>
              <span className="block rounded-md border border-border-light bg-light-bg px-3 py-1 text-base text-gray-700 hover:shadow-sm dark:border-border dark:bg-primary-light dark:text-text-secondary">
                {tech}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full rounded-md border border-border-light p-6 dark:border-border sm:w-[calc(100%/2-1rem)] md:w-[calc(100%/3-1.5rem)]">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">
          I am available for
        </h1>
        <p className="text-base text-gray-700 dark:text-text-secondary">
          I am available for mentoring and collaborations. I am also available
          for full-time or contract Developer Relations roles.
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
