import { Aside, RightAsideMain } from "~/component/aside";
import ExploreMainComponent from "./ExploreMainComponent";

const ExploreMainBody = () => {
  return (
    <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 sm:px-4">
        <Aside />
        <ExploreMainComponent />
        <RightAsideMain />
      </div>
    </main>
  );
};

export default ExploreMainBody;
