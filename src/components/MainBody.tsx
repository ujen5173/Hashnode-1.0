import Aside from "./Aside";
import RightAsideMain from "./RightAsideMain";
import MainBodyArticles from "./MainBodyArticles";

const MainBody = () => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="mx-auto flex max-w-[1550px] justify-between gap-4 px-4">
        <Aside />
        <MainBodyArticles />
        <RightAsideMain />
      </div>
    </main>
  );
};

export default MainBody;
