import type { FC } from "react";
import { type UserDetailsInterface } from "~/pages/u/[username]";
import Aside from "./Aside";
import ProfileArea from "./ProfileArea";

const UserProfileMainBody: FC<{
  user: UserDetailsInterface;
}> = ({ user }) => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 sm:px-4">
        <Aside />
        <ProfileArea user={user} />
      </div>
    </main>
  );
};

export default UserProfileMainBody;
