
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";

const FollowHeader: FC<{
  user: {
    followersCount: number;
    username: string;
    followingCount: number;
  };
}> = ({ user }) => {
  const path = useRouter();

  return (
    <header className="flex gap-1 border-b border-border-light px-3 dark:border-border">
      <Link href={`/u/@${user.username}/followers`}>
        <button
          className={`${path.pathname?.includes("followers") ? "btn-tab-active" : "btn-tab"
            } font-semibold`}
        >
          Followers ({user.followersCount})
        </button>
      </Link>

      <Link href={`/u/@${user.username}/following`}>
        <button
          className={`${path.pathname?.includes("following") ? "btn-tab-active" : "btn-tab"
            } font-semibold`}
        >
          Following ({user.followingCount})
        </button>
      </Link>
    </header>
  );
};

export default FollowHeader;