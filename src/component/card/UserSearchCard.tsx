import { Tooltip } from "@mantine/core";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import { Check, Follow } from "~/svgs";
import { api } from "~/utils/api";

interface Props {
  user: {
    id: string;
    name: string;
    username: string;
    stripeSubscriptionStatus: string | null;
    profile: string;
    isFollowing: boolean;
  };
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSearchCard: FC<Props> = ({ user: searchedUser, setOpened }) => {
  const { data: user } = useSession();

  const [isFollowing, setIsFollowing] = useState<boolean>(
    searchedUser.isFollowing
  );

  const { mutate: followToggle } = api.users.followUserToggle.useMutation();

  const followUser = () => {
    if (!user) {
      return toast.error("You need to be logged in to follow users");
    }

    if (searchedUser.username === user.user.username) {
      return toast.error("You can't follow yourself");
    }

    setIsFollowing(!isFollowing);

    followToggle({
      username: searchedUser.username,
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
            src={searchedUser.profile}
            alt={searchedUser.name}
            className="h-9 w-9 rounded-full md:h-12 md:w-12"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-700 dark:text-text-secondary md:text-lg">
                {searchedUser.name}
              </h3>
              {
                searchedUser.stripeSubscriptionStatus === "active" && (
                  <Tooltip label="Hashnode Clone Pro User" position="bottom" style={{
                    fontSize: "0.8rem",
                    fontWeight: "400",
                    letterSpacing: "0.5px"
                  }}>
                    <span className="px-2 py-1 tracking-wider rounded-md bg-light-bg dark:bg-primary-light border border-border-light dark:border-border font-semibold text-xs text-gray-700 dark:text-text-secondary">PRO</span>
                  </Tooltip>
                )
              }
            </div>

            <p className="text-sm text-gray-500 dark:text-text-primary">
              {searchedUser.username}
            </p>
          </div>
        </div>
      </Link>

      <button
        onClick={() => void followUser()}
        className="btn-outline flex items-center justify-center gap-2 text-secondary md:w-max"
      >
        {isFollowing ? (
          <>
            <Check className="h-5 w-5 fill-secondary" />
            <span className="text-sm md:text-base">Following</span>
          </>
        ) : (
          <>
            <Follow className="h-5 w-5 fill-secondary" />
            <span className="text-sm md:text-base">Follow User</span>
          </>
        )}
      </button>
    </div>
  );
};

export default UserSearchCard;
