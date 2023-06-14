import { type GetServerSideProps } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";
import { Header } from "~/components";
import UserProfileMainBody from "~/components/UserProfileBody";
import UserBlogSEO from "~/SEO/UserBlog.seo";
import { authOptions } from "~/server/auth";
import { C, type ContextValue } from "~/utils/context";

const UserBlog = () => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);
  
  return (
    <>
      <UserBlogSEO />
      <Header />
      <UserProfileMainBody />
    </>
  );
};

export default UserBlog;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
    },
  };
};
