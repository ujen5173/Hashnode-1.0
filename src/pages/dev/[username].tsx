import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, type FC } from "react";
import { toast } from "react-toastify";
import { AuthorBlogHeader, Footer } from "~/components";
import AuthorBlogArticleArea from "~/components/AuthorBlogArticleArea";
import AuthorBlog from "~/SEO/AuthorBlog.seo";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { C, type ContextValue } from "~/utils/context";

export interface BlogSocial {
  twitter: string;
  mastodon: string;
  instagram: string;
  github: string;
  website: string;
  linkedin: string;
  youtube: string;
  dailydev: string;
}

export interface CustomTabs {
  id: string;
  label: string;
  type: string;
  value: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorBlogs: NextPage<{
  user: {
    name: string;
    profile: string;
    handle: {
      handle: string;
      name: string;
      social: BlogSocial;
      customTabs: CustomTabs[];
    };
    username: string;
    followers: { id: string }[];
  };
}> = ({ user }) => {
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;
  const router = useRouter();
  const { data, isLoading, isError } =
    api.posts.getAuthorArticlesByHandle.useQuery(
      {
        handle: router.query.username
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
      <AuthorBlogNavigation tabs={user.handle.customTabs} />{" "}
      {/* Home, Badge, Newsletter */}
      <AuthorBlogArticleArea data={data} isLoading={isLoading} user={user} />
      <Footer />
    </>
  );
};

export default AuthorBlogs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const username = context.query.username as string;

  const user = await prisma.user.findFirst({
    where: {
      handle: {
        handle: username.slice(1, username.length),
      },
    },
    select: {
      username: true,
      name: true,
      profile: true,
      handle: {
        select: {
          handle: true,
          name: true,
          customTabs: true,
          social: true,
        },
      },
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
            handle: {
              handle: string;
              name: string;
              social: BlogSocial;
              customTabs: CustomTabs[];
            };
            followers: { id: string }[];
          })
        : null,
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
    },
  };
};

const AuthorBlogNavigation: FC<{ tabs: CustomTabs[] }> = ({ tabs }) => {
  return (
    <section className="hidden border-b border-border-light bg-white dark:border-border dark:bg-primary lg:block">
      <div className="mx-auto flex max-w-[1300px] items-center justify-center px-4">
        <div className="flex items-center gap-4">
          <ul className="flex">
            <li className="border-b-2 border-gray-500 py-2 dark:border-gray-400">
              <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-primary-light">
                Home
              </span>
            </li>
            <li className="py-2">
              <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-primary-light">
                Badge
              </span>
            </li>
            {tabs.map((tab) => (
              <li key={tab.id} className="py-2">
                <a target="_blank" href={tab.value}>
                  <span className="cursor-pointer rounded-md bg-transparent px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-primary-light">
                    {tab.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
