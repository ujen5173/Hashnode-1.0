import React from "react";
import DateSVG from "~/svgs/Date";
import Instagram from "~/svgs/Instagram";
import Linkedin from "~/svgs/Linkedin";
import Location from "~/svgs/Location";
import Twitter from "~/svgs/Twitter";

const ProfileDetail = () => {
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
          Kuala Lumpur, Malaysia
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DateSVG className="h-6 w-6 fill-gray-700 dark:fill-text-primary" />
        <span className="text-base text-gray-700 dark:text-text-primary">
          Member Since Aug, 2021
        </span>
      </div>
    </div>
  );
};

export default ProfileDetail;
