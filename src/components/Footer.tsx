import React from "react";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-light-bg px-4 py-16 dark:bg-black">
      <p className="text-gray-700 dark:text-text-secondary">
        @{new Date().getFullYear()} Hashnode By{" "}
        <a
          href="https://github.com/ujen5173"
          className="font-semibold text-secondary underline"
        >
          Ujen Basi
        </a>
      </p>
      <ul className="my-4 flex gap-1 text-gray-700 dark:text-text-secondary">
        <li>Archive</li>·<li>Privacy policy</li>·<li>Terms</li>
      </ul>

      <a
        href="https://github.com/ujen5173/hashnode-clone"
        className="my-6 rounded-md border border-border-light px-6 py-3 text-black outline-none dark:border-border dark:text-white"
      >
        View Github
      </a>

      <p className="text-gray-700 dark:text-text-secondary">
        Powered by Hashnode - Home for tech writers and readers{" "}
      </p>
    </div>
  );
};

export default Footer;
