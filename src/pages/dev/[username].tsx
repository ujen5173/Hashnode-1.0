import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthorBlogHeader, Footer } from "~/components";
import AuthorBlogArticleArea from "~/components/AuthorBlogArticleArea";
import AuthorBlog from "~/SEO/AuthorBlog.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

const AuthorBlogs: NextPage<{
  user: {
    name: string;
    profile: string;
    username: string;
    followers: { id: string }[];
  };
}> = ({ user }) => {
  console.log({ user });
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;
  const router = useRouter();
  const { data, isLoading, isError } = api.posts.getAuthorArticles.useQuery(
    {
      username: router.query.username
        ? (router.query?.username.slice(
            1,
            router.query?.username.length
          ) as string) || ""
        : "",
    },
    {
      enabled: !!router.query.username,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setUser(session);
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isError]);

  return (
    <>
      <AuthorBlog author={user} />
      <AuthorBlogHeader user={user} />
      <AuthorBlogNavigation /> {/* Home, Badge, Newsletter */}
      <AuthorBlogArticleArea data={data} isLoading={isLoading} />
      <Footer />
    </>
  );
};

export default AuthorBlogs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const username = context.query.username as string;

  const user = await prisma.user.findUnique({
    where: {
      username: username.slice(1, username.length),
    },
    select: {
      username: true,
      name: true,
      profile: true,
      followers: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    return {
      notFound: true,
      redirect: {
        destination: "/404",
      },
    };
  }

  return {
    props: {
      user: user
        ? (JSON.parse(JSON.stringify(user)) as {
            username: string;
            profile: string;
            followers: { id: string }[];
          })
        : null,
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
    },
  };
};

const AuthorBlogNavigation = () => {
  return (
    <section className="hidden border-b border-border-light bg-white dark:border-border dark:bg-primary lg:block">
      <div className="mx-auto flex max-w-[1300px] items-center justify-center px-4">
        <div className="flex items-center gap-4">
          <ul className="flex">
            <li className="border-b-2 border-gray-500 py-2 dark:border-gray-400">
              <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium hover:bg-gray-100 dark:hover:bg-primary-light">
                Home
              </span>
            </li>
            <li className="py-2">
              <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium hover:bg-gray-100 dark:hover:bg-primary-light">
                Badge
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
