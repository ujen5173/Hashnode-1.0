import Image from "next/image";
import Link from "next/link";
import { useContext, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Check, Follow } from "~/svgs";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const UserSearchCard: FC<{
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    isFollowing: boolean;
  };
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ user: searchedUser, setOpened }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(
    searchedUser.isFollowing
  );
  const { user } = useContext(C) as ContextValue;

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
        className="tag flex flex-1 items-center justify-between"
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
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              {searchedUser.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-text-primary">
              {searchedUser.username}
            </p>
          </div>
        </div>
      </Link>
      <button
        onClick={() => void followUser()}
        className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
      >
        {isFollowing ? (
          <>
            <Check className="h-5 w-5 fill-secondary" />
            Following
          </>
        ) : (
          <>
            <Follow className="h-5 w-5 fill-secondary" />
            Follow User
          </>
        )}
      </button>
    </div>
  );
};

export default UserSearchCard;
