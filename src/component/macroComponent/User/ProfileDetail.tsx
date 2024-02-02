import {
  Calendar,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  Twitter,
  Youtube,
} from "lucide-react";
import { type FC } from "react";
import { Stackoverflow } from "~/svgs";

import { type DetailedUser } from "~/types";

const imageDetail: FC<{
  userDetails: DetailedUser | undefined;
}> = ({ userDetails }) => {
  return (
    <div className="my-6 flex w-full flex-wrap items-center justify-center gap-4 rounded-md border border-border-light px-6 py-4 dark:border-border lg:py-6">
      <div className="flex items-center gap-1 overflow-hidden">
        {userDetails?.social &&
          Object.entries(userDetails.social).map((data, index) => {
            const [key, value] = data as [
              keyof typeof userDetails.social,
              string
            ];

            if (value.trim() === "") return null;
            return (
              <a href={value} target="_blank" key={index}>
                <button className="btn-icon-large flex">
                  {key === "twitter" ? (
                    <Twitter className="h-4 w-4 fill-none stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "instagram" ? (
                    <Instagram className="h-4 w-4 stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "github" ? (
                    <Github className="h-4 w-4 fill-none stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "stackoverflow" ? (
                    <Stackoverflow className="h-4 w-4 stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "facebook" ? (
                    <Facebook className="h-4 w-4 stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "website" ? (
                    <Globe className="h-4 w-4 stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "linkedin" ? (
                    <Linkedin className="h-4 w-4 stroke-gray-500 dark:stroke-text-primary" />
                  ) : key === "youtube" ? (
                    <Youtube className="h-4 w-4 stroke-gray-500 dark:stroke-text-primary" />
                  ) : null}
                </button>
              </a>
            );
          })}
      </div>

      {userDetails?.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />

          <span className="text-sm text-gray-700 dark:text-text-primary md:text-base">
            {userDetails?.location}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 stroke-gray-700 dark:stroke-text-secondary" />

        <span className="text-sm text-gray-700 dark:text-text-primary md:text-base">
          Member Since{" "}
          {userDetails?.createdAt &&
            new Date(userDetails?.createdAt).getFullYear()}
        </span>
      </div>
    </div>
  );
};

export default imageDetail;
