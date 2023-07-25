import { type FC } from "react";
import { type UserDetailsInterface } from "~/pages/u/[username]";
import {
  DateSVG,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Location,
  Stackoverflow,
  Twitter,
  Web,
  Youtube,
} from "~/svgs";

const ProfileDetail: FC<{
  userDetails: UserDetailsInterface | undefined;
}> = ({ userDetails }) => {
  return (
    <div className="my-6 flex w-full flex-wrap items-center justify-center gap-4 rounded-md border border-border-light px-6 py-4 dark:border-border md:gap-8 lg:gap-10 lg:py-6">
      <div className="flex items-center gap-2 overflow-hidden">
        {/*! TODO: Below code is not working properly. :( */}
        {userDetails &&
          userDetails.social &&
          Object.entries(userDetails.social).map((data, index) => {
            const [key, value] = data as [
              keyof typeof userDetails.social,
              string
            ];

            if (value === "") return null;
            return (
              <a href={value} target="_blank" key={index}>
                <button className="btn-icon-large flex">
                  {key === "twitter" ? (
                    <Twitter className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "instagram" ? (
                    <Instagram className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "github" ? (
                    <Github className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "stackoverflow" ? (
                    <Stackoverflow className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "facebook" ? (
                    <Facebook className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "website" ? (
                    <Web className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "linkedin" ? (
                    <Linkedin className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : key === "youtube" ? (
                    <Youtube className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
                  ) : null}
                </button>
              </a>
            );
          })}
      </div>
      {userDetails?.location && (
        <div className="flex items-center gap-2">
          <Location className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
          <span className="text-sm text-gray-700 dark:text-text-primary md:text-base">
            {userDetails?.location}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <DateSVG className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
        <span className="text-sm text-gray-700 dark:text-text-primary md:text-base">
          Member Since{" "}
          {userDetails?.createdAt &&
            new Date(userDetails?.createdAt).getFullYear()}
        </span>
      </div>
    </div>
  );
};

export default ProfileDetail;
