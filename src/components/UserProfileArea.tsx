import React from "react";
import Image from "next/image";
import { Add, Angledown, ProfileShare } from "~/svgs";

const UserProfileArea = () => {
  return (
    <div className="mb-10 flex flex-col gap-8 md:flex-row">
      <Image
        src={
          "https://cdn.hashnode.com/res/hashnode/image/upload/v1629063104225/o7zmluXlB.png?w=500&h=500&fit=crop&crop=faces&auto=compress,format&format=webp"
        }
        alt=""
        width={100}
        className="h-44 w-44 rounded-full object-cover"
        height={100}
      />

      <div className="flex flex-1 flex-col items-start gap-4 lg:flex-row">
        <div className="flex w-full flex-1 items-start justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-700 dark:text-text-secondary">
              Oviekhaye Divine
            </h1>
            <p className="mb-6 text-lg font-medium text-gray-500 dark:text-text-secondary">
              Frontend developer and UI/UX designer
            </p>
            <div className="flex gap-4 text-gray-700 dark:text-text-primary">
              <span>1 Follower</span>
              <span>1 Following</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-icon-outline">
              <ProfileShare className="h-5 w-5 fill-gray-700 dark:fill-text-secondary" />
            </button>
            <button className="btn-icon-outline">
              <Angledown className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
            </button>
          </div>
        </div>

        <button
          aria-label="icon"
          role="button"
          className="btn-follow-filled gap-2"
        >
          <span>
            <Add className="h-4 w-4 fill-white stroke-none" />
          </span>
          <span>Follow</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileArea;
