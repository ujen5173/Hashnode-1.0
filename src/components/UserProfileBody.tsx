import type { User } from "@prisma/client";
import type { FC } from "react";
import Aside from "./Aside";
import ProfileArea from "./ProfileArea";

const UserProfileMainBody: FC<{
  user: User & {
    isFollowing: boolean;
    followers: { id: string }[];
  };
}> = ({ user }) => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 px-4">
        <Aside />
        <ProfileArea user={user} />
      </div>
    </main>
  );
};

export default UserProfileMainBody;
