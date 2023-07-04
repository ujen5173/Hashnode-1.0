import Aside from "./Aside";
import MainBodyArticles from "./MainBodyArticles";
import RightAsideMain from "./RightAsideMain";

const MainBody = () => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 sm:px-4">
        <Aside />
        <MainBodyArticles />
        <RightAsideMain />
      </div>
    </main>
  );
};

export default MainBody;
