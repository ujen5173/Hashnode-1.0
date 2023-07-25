import Link from "next/link";
import React from "react";
import { others } from "~/utils/constants";

const Others = () => {
  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Others
        </h1>
      </header>

      <div>
        {others.map((other, index) => {
          return (
            <div
              key={index}
              className="flex flex-wrap gap-2 border-b border-border-light py-4 last:border-0 dark:border-border"
            >
              {other.map((item, index) => {
                return (
                  <Link
                    href={item.link}
                    key={index}
                    className="flex w-[calc(100%/2-0.5rem)] items-center gap-2 text-gray-600 hover:text-secondary hover:underline dark:text-text-primary"
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Others;
