import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";
import ProfileDetail from "./ProfileDetail";
import UserBlogingArea from "./UserBlogingArea";
import UserDetails from "./UserDetails";
import UserProfileArea from "./UserProfileArea";
import UserRecentActivities from "./UserRecentActivities";

const ProfileArea = () => {
  const username = useRouter().query.username as string;
  const { setFollowing } = useContext(C) as ContextValue;
  const { data: userDetails } = api.users.getUserByUsername.useQuery(
    {
      username,
    },
    {
      enabled: !!username,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setFollowing({
      status: userDetails?.isFollowing as boolean,
      followersCount: userDetails?.followersCount.toString() as string,
    });
  }, [userDetails]);

  return (
    <main className="my-4 min-h-screen flex-[5.75] rounded-md border border-border-light bg-white px-4 py-10 dark:border-border dark:bg-primary md:px-12 md:py-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      <UserProfileArea userDetails={userDetails} />
      <ProfileDetail userDetails={userDetails} />
      <UserDetails userDetails={userDetails} />
      <UserBlogingArea userDetails={userDetails} />
      <UserRecentActivities />
    </main>
  );
};

export default ProfileArea;
