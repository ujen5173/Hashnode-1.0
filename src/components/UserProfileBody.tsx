import Aside from "./Aside";
import ProfileArea from "./ProfileArea";

const UserProfileMainBody = () => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="mx-auto flex max-w-[1550px] justify-between gap-4 px-4">
        <Aside />
        <ProfileArea />
      </div>
    </main>
  );
};

export default UserProfileMainBody;
