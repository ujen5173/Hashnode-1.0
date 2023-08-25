import type { FC } from "react";
import { type DetailedUser } from "~/types";
import { Aside } from "../../aside";
import ProfileArea from "./ProfileArea";

const UserProfileBody: FC<{
  user: DetailedUser;
}> = ({ user }) => {
  return (
    <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 sm:px-4">
        <Aside />
        <ProfileArea user={user} />
      </div>
    </main>
  );
};

export default UserProfileBody;
