
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { DateSVG, Pen } from "~/svgs";

const FollowProfileArea: FC<{
  user: {
    name: string;
    username: string;
    followersCount: number;
    followingCount: number;
    profile: string;
    createdAt: Date;
  }
}> = ({ user }) => {
  const { data: session } = useSession();

  return <div className="w-full md:w-1/4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
    <Link href={`/u/@${user.username}`}>
      <Image
        src={user.profile}
        width={800}
        height={800}
        className="mb-4 h-28 w-28 overflow-hidden rounded-full object-cover"
        alt="User Profile"
      />
    </Link>

    <Link href={`/u/@${user.username}`}>
      <h1 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-text-secondary">{user.name}</h1>
    </Link>

    {user.username === session?.user.username && (
      <Link href="/settings" className="btn-outline inline-flex mb-4 items-center gap-2">
        <Pen className="h-5 w-5 fill-none stroke-secondary" />
        <span>Edit Profile</span>
      </Link>
    )}

    <div className="flex items-center gap-2">
      <span>
        <DateSVG className="h-4 w-4 fill-gray-500 dark:fill-text-primary" />
      </span>

      <span className="text-lg text-gray-500 dark:text-text-primary">
        Member since{" "}
        <span className="font-medium">
          {new Date(user.createdAt).toDateString()}
        </span>
      </span>
    </div>
  </div>
}
export default FollowProfileArea;