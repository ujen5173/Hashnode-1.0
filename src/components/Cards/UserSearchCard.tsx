import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

const UserSearchCard: FC<{
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    followersCount: number;
  };
}> = ({ user }) => {
  return (
    <Link href={`/u/@${user.username}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Image
            width={50}
            height={50}
            src={user.profile}
            alt={user.name}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
              {user.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-text-primary">
              {user.username}
            </p>
          </div>
        </div>
        <button className="btn-filled">Follow</button>
      </div>
    </Link>
  );
};

export default UserSearchCard;
