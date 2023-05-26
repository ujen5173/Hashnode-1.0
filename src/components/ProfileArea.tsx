import ProfileDetail from "./ProfileDetail";
import UserBlogingArea from "./UserBlogingArea";
import UserDetails from "./UserDetails";
import UserProfileArea from "./UserProfileArea";
import UserRecentActivities from "./UserRecentActivities";

const ProfileArea = () => {
  return (
    <main className="my-4 min-h-screen flex-[5.75] rounded-md border border-border-light bg-white px-4 py-10 dark:border-border dark:bg-primary md:px-12 md:py-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      <UserProfileArea />
      <ProfileDetail />
      <UserDetails />
      <UserBlogingArea />
      <UserRecentActivities />
    </main>
  );
};

export default ProfileArea;
