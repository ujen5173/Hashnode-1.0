import React from "react";
import { Header } from "~/components";
import Aside from "~/components/Aside";
import MainTagBody from "~/components/MainTagBody";
import RightAsideMain from "~/components/RightAsideMain";

const SingleTag = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 px-4">
          <Aside />
          <MainTagBody />
          <RightAsideMain />
        </div>
      </main>
    </>
  );
};

export default SingleTag;
