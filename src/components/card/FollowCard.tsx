import { Tooltip } from "@mantine/core";
import { Check, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FC } from "react";

const FollowCard: FC<{
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    tagline: string | null;
    isFollowing: boolean;
  };
  followUser: (username: string) => void;
}> = ({ user, followUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(user.isFollowing);
  }, [user]);

  return (
    <div className="flex w-full items-center gap-2 rounded-md border border-border-light bg-light-bg p-4 dark:border-border dark:bg-primary-light md:w-[calc(100%/2-0.5rem)] lg:w-[calc(100%/3-0.5rem)]">
      <div className="flex flex-1 gap-2">
        <Link href={`/u/@${user.username}`}>
          <Image
            src={user.image ?? "/static/default.avif"}
            width={60}
            height={60}
            className="h-10 w-10 rounded-full object-cover"
            alt="User image"
          />
        </Link>

        <div>
          <Link href={`/u/@${user.username}`}>
            <h1 className="text-base font-semibold text-gray-900 dark:text-text-secondary">
              {user.name}
            </h1>
          </Link>
          <p className="text-sm text-gray-500 dark:text-text-primary">
            {user.tagline}
          </p>
        </div>
      </div>

      <Tooltip label={isFollowing ? "UnFollow" : "Follow"} position="bottom">
        <button
          onClick={() => {
            followUser(user.id);
            setIsFollowing((prev) => !prev);
          }}
          arial-label="Follow/Unfollow Button"
          className="rounded-full border border-border-light bg-white p-2 hover:bg-border-light dark:border-border dark:bg-primary dark:hover:bg-border"
        >
          {isFollowing ? (
            <Check className="h-5 w-5 stroke-green" />
          ) : (
            <Plus className="h-5 w-5 stroke-slate-600 dark:stroke-slate-300" />
          )}
        </button>
      </Tooltip>
    </div>
  );
};
export default FollowCard;
