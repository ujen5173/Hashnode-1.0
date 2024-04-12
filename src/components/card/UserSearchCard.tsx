import { Tooltip } from "@mantine/core";
import { Check, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

interface Props {
  user: {
    id: string;
    name: string;
    username: string;
    stripeSubscriptionStatus: string | null;
    image: string | null;
    isFollowing: boolean;
    isAuthor: boolean;
  };
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSearchCard: FC<Props> = ({ user: searchedUser, setOpened }) => {
  const { data: user } = useSession();

  const [isFollowing, setIsFollowing] = useState<boolean>(
    searchedUser.isFollowing,
  );

  const { mutate: followToggle } = api.users.followUser.useMutation();

  const followUser = () => {
    if (!user) {
      return toast.error("You need to be logged in to follow users");
    }

    if (searchedUser.username === user.user.username) {
      return toast.error("You can't follow yourself");
    }

    setIsFollowing(!isFollowing);

    followToggle({
      userId: searchedUser.id,
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <Link
        href={`/u/@${searchedUser.username}`}
        className="flex flex-1 items-center justify-between"
      >
        <div
          onClick={() => void setOpened(false)}
          className="flex flex-1 items-center gap-4"
        >
          <Image
            width={50}
            height={50}
            src={searchedUser.image ?? "/static/default.avif"}
            alt={searchedUser.name}
            className="h-9 w-9 rounded-full md:h-12 md:w-12"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary md:text-lg">
                {searchedUser.name}
              </h3>
              {searchedUser.stripeSubscriptionStatus === "active" && (
                <Tooltip
                  label="Hashnode Clone Pro User"
                  position="bottom"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    letterSpacing: "0.5px",
                  }}
                >
                  <span className="rounded-md border border-border-light bg-light-bg px-2 py-1 text-xs font-semibold tracking-wider text-gray-700 dark:border-border dark:bg-primary-light dark:text-text-secondary">
                    PRO
                  </span>
                </Tooltip>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-text-primary">
              @{searchedUser.username}
            </p>
          </div>
        </div>
      </Link>

      {!searchedUser.isAuthor && (
        <button
          onClick={() => void followUser()}
          className="btn-outline flex items-center justify-center gap-2 text-secondary md:w-max"
        >
          {isFollowing ? (
            <>
              <Check className="h-5 w-5 stroke-secondary" />
              <span className="text-sm md:text-base">Following</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 stroke-secondary" />
              <span className="text-sm md:text-base">Follow User</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default UserSearchCard;
