import React from "react";

const Notification = () => {
  return (
    <div className="w-[35rem] rounded-md bg-white p-4 shadow-md dark:bg-black">
      <h1 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
        Notification
      </h1>

      <header className="scroll-area overflow-auto border-b border-border-light px-4 dark:border-border">
        <div className="flex w-max items-end justify-center gap-2">
          <button className="btn-tab-secondary">All Notifications</button>
          <button className="btn-tab-secondary">Comments</button>
          <button className="btn-tab-secondary">Likes</button>
          <button className="btn-tab-secondary">Articles</button>
          <button className="btn-tab-secondary">@ Mentions</button>
        </div>
      </header>

      <section className="flex min-h-[20rem] items-center justify-center p-4 text-center">
        <span className="text-gray-700 dark:text-text-secondary">
          No Notifications yet!
        </span>
      </section>
    </div>
  );
};

export default Notification;
