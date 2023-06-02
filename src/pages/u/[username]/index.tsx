import React from "react";
import { Header } from "~/components";
import UserProfileMainBody from "~/components/UserProfileBody";
import UserBlogSEO from "~/SEO/UserBlog.seo";

const UserBlog = () => {
  return (
    <>
      <UserBlogSEO />
      <Header />
      <UserProfileMainBody />
    </>
  );
};

export default UserBlog;
