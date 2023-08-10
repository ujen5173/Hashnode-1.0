import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthorBlog from "~/SEO/AuthorBlog.seo";
import {
  AuthorBlogHeader,
  Footer,
  SimpleArticleCard,
  SimpleArticleCardLoading,
} from "~/component";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { Pen } from "~/svgs";
import { api } from "~/utils/api";
import { AuthorBlogNavigation, type BlogSocial, type CustomTabs } from "..";

const SeiesPage: NextPage<{
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    bio: string;
    handle: {
      id: string;
      handle: string;
      name: string;
      social: BlogSocial;
      about: string;
      customTabs: CustomTabs[];
    };
    followers: { id: string }[];
  };
}> = ({ user }) => {
  return (
    <>
      <AuthorBlog author={user} />
      <AuthorBlogHeader user={user} />
      {/* Home, Badge, Newsletter */}
      <AuthorBlogNavigation tabs={user.handle.customTabs} />

      <SeriesContainer />
      <Footer />
    </>
  );
};

export default SeiesPage;

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
      id: true,
      name: true,
      username: true,
      profile: true,
      bio: true,
      handle: {
        select: {
          id: true,
          handle: true,
          name: true,
          customTabs: true,
          about: true,
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

const SeriesContainer = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const { data, isLoading, error } = api.series.getSeriesOfArticle.useQuery(
    {
      slug: slug as string,
    },
    {
      enabled: !!slug,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (error && error.data?.code === "NOT_FOUND") {
      void router.push("/404");
    }
  }, [error]);

  return (
    <div className="w-full bg-white dark:bg-primary">
      <div className="mx-auto max-w-[1000px] px-4 py-8">
        <div className="flex gap-4">
          <div>
            <h1 className="text-sm font-medium uppercase text-gray-500 dark:text-text-primary">
              Series
            </h1>
            <h1 className="mb-2 text-4xl font-bold text-gray-700 dark:text-text-secondary">
              {data?.title}
            </h1>
            <h1 className="mb-4 text-base text-gray-500 dark:text-text-primary">
              {data?.description}
            </h1>
            <button className="flex items-center gap-2 rounded-md border border-secondary px-4 py-1">
              <Pen className="h-4 w-4 fill-none stroke-secondary" />
              <span className="text-secondary">Edit Series</span>
            </button>
          </div>
          {data?.cover_image && (
            <div>
              <Image
                src={data?.cover_image}
                width={1200}
                height={800}
                className="w-2/6 object-cover"
                alt=""
              />
            </div>
          )}
        </div>
        <div className="hr-line-between-text mt-10 flex items-center justify-center">
          <span className="text-gray-700 dark:text-text-secondary">Articles in this series</span>
        </div>

        <div className="flex flex-wrap gap-4 py-6">
          {isLoading ? (
            <>
              <SimpleArticleCardLoading />
              <SimpleArticleCardLoading />
              <SimpleArticleCardLoading />
              <SimpleArticleCardLoading />
            </>
          ) : (
            data?.articles.map((article) => (
              <SimpleArticleCard article={article} key={article.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
