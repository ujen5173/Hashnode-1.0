import { type FC } from "react";
import { type DetailedUser } from "~/types";
import ProfileDetail from "./ProfileDetail";
import UserBlogingArea from "./UserBlogingArea";
import UserDetails from "./UserDetails";
import UserProfileArea from "./UserProfileArea";
import UserRecentActivities from "./UserRecentActivities";

const ProfileArea: FC<{
  user: DetailedUser;
}> = ({ user }) => {

  return (
    <main className="container-full-main my-4 min-h-[100dvh] rounded-md border border-border-light bg-white px-4 py-6 dark:border-border dark:bg-primary md:px-12 md:py-8 lg:px-16 lg:py-10 xl:px-28 xl:py-24">
      <UserProfileArea userDetails={user} />
      <ProfileDetail userDetails={user} />
      <UserDetails userDetails={user} />
      {user?.handle && <UserBlogingArea userDetails={user} />}
      <UserRecentActivities />
    </main>
  );
};

export default ProfileArea;
