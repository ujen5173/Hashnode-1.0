import { type User } from "@prisma/client";
import React, { type FC } from "react";
import { DateSVG, Instagram, Linkedin, Location, Twitter } from "~/svgs";

const ProfileDetail: FC<{ userDetails: User | undefined }> = ({
  userDetails,
}) => {
  return (
    <div className="my-6 flex w-full flex-wrap items-center justify-center gap-10 rounded-md border border-border-light px-6 py-6 dark:border-border">
      <div className="flex items-center gap-2">
        <button className="btn-icon-large flex">
          <Linkedin className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
        </button>
        <button className="btn-icon-large flex">
          <Twitter className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
        </button>
        <button className="btn-icon-large flex">
          <Instagram className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Location className="h-6 w-6 fill-gray-700 dark:fill-text-primary" />
        <span className="text-base text-gray-700 dark:text-text-primary">
          Kathmandu, Nepal
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DateSVG className="h-6 w-6 fill-gray-700 dark:fill-text-primary" />
        <span className="text-base text-gray-700 dark:text-text-primary">
          Member Since {new Date(userDetails?.createdAt || "").getFullYear()}
        </span>
      </div>
    </div>
  );
};

export default ProfileDetail;
