import React from "react";
import Aside from "./Aside";
import ExploreMainComponent from "./ExploreMainComponent";
import RightAsideMain from "./RightAsideMain";

const ExploreMainBody = () => {
  return (
    <main className="min-h-screen w-full bg-light-bg dark:bg-black">
      <div className="container-body mx-auto max-w-[1550px] gap-4 px-4">
        <Aside />
        <ExploreMainComponent />
        <RightAsideMain />
      </div>
    </main>
  );
};

export default ExploreMainBody;
