import { type GetServerSideProps } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Header } from "~/components";
import {
  Advanced,
  Analytics,
  Appearance,
  Articles,
  DashboardPageNotFound,
  Domain,
  Export,
  General,
  GitHub,
  Import,
  Integrations,
  Navbar,
  Newsletter,
  Pages,
  SEO,
  Series,
  Sponsors,
  Widgets,
} from "~/components/dashboard";
import DashboardSEO from "~/SEO/Dashboard.seo";
import { authOptions } from "~/server/auth";
import {
  BoardedDownArrow,
  CheckFilled,
  Customize,
  Global,
  LogonoText,
  Pen,
  Redirect,
} from "~/svgs";
import { dashboardNavigations } from "~/utils/constants";
import { C, type ContextValue } from "~/utils/context";

// All dashboard navigations
const componentMap = {
  general: <General />,
  appearance: <Appearance />,
  navbar: <Navbar />,
  articles: <Articles />,
  series: <Series />,
  pages: <Pages />,
  sponsors: <Sponsors />,
  analytics: <Analytics />,
  widgets: <Widgets />,
  newsletter: <Newsletter />,
  integrations: <Integrations />,
  seo: <SEO />,
  domain: <Domain />,
  gitHub: <GitHub />,
  import: <Import />,
  export: <Export />,
  advanced: <Advanced />,
  "404": <DashboardPageNotFound />,
};

const Dashboard = () => {
  const paths = useRouter().query;
  const { data: session } = useSession();
  const { setUser } = useContext(C) as ContextValue;

  useEffect(() => {
    setUser(session);
  }, []);

  const [dashboardName, setDashboardName] = useState<React.ReactNode>(
    componentMap.general
  );

  useEffect(() => {
    // set dashboard component based on the path. if path is incorrect, set 404 component else set respective component and if path is undefined, set general component
    setDashboardName(
      componentMap[
        (paths.dashboard
          ? dashboardNavigations
              .map((e) => e.name.toLowerCase())
              .includes(paths.dashboard[0] as string)
            ? (paths.dashboard[0] as string)
            : "404"
          : "general") as keyof typeof componentMap
      ]
    );
  }, [paths.dashboard]);

  return (
    <>
      <DashboardSEO />
      <Header search={false} />
      <div className="bg-light-bg dark:bg-black">
        <div className="mx-auto max-w-[1550px] gap-4 py-8 sm:px-4">
          <div className="mb-6 flex w-full flex-col items-center justify-between rounded-md border border-border-light bg-white px-6 py-8 dark:border-border dark:bg-primary sm:flex-row">
            <div className="mb-4 flex w-full max-w-[20rem] cursor-pointer items-center justify-between rounded-full border border-border-light bg-light-bg px-4 py-2 hover:bg-border-light dark:border-border dark:bg-primary-light dark:hover:bg-border sm:mb-0">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-white p-1">
                  <LogonoText className="h-6 w-6 fill-secondary" />
                </div>
                <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                  {session?.user.name}&apos;s Blog
                </h1>
              </div>

              <button>
                <BoardedDownArrow className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Link href={`/dev/@${session?.user.username as string}`}>
                <div className="flex items-center gap-2">
                  <Redirect className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
                  <span className="font-medium text-gray-600 dark:text-text-primary">
                    Visit Blog
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className="mb-6 w-full rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
            <h1 className="mb-4 text-base font-semibold text-gray-700 dark:text-text-secondary">
              Welcome to your new blog! What&apos;s next?
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex w-full cursor-pointer items-center gap-4 rounded-md border border-border-light p-4 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]">
                <div className="absolute right-2 top-2">
                  <Pen className="h-5 w-5 fill-none stroke-gray-500 dark:stroke-text-primary" />
                </div>
                <CheckFilled className="h-7 w-7 fill-green md:h-10 md:w-10" />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-secondary">
                    Write your first article
                  </h1>
                  <p className="text-base text-gray-500 dark:text-text-primary">
                    Share your thoughts, and connect with the community by
                    writing your first article.
                  </p>
                </div>
              </div>
              <div className="relative flex w-full cursor-pointer items-center gap-4 rounded-md border border-border-light p-4 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]">
                <div className="absolute right-2 top-2">
                  <Customize className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
                </div>
                <CheckFilled className="h-7 w-7 fill-green md:h-10 md:w-10" />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-secondary">
                    Customizing the appearance
                  </h1>
                  <p className="text-base text-gray-500 dark:text-text-primary">
                    Personalize the design of your blog and showcase your
                    personality.
                  </p>
                </div>
              </div>
              <div className="relative flex w-full cursor-pointer items-center gap-4 rounded-md border border-border-light p-4 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]">
                <div className="absolute right-2 top-2">
                  <Global className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
                </div>
                <CheckFilled className="h-7 w-7 fill-green md:h-10 md:w-10" />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-secondary">
                    Map a custom domain
                  </h1>
                  <p className="text-base text-gray-500 dark:text-text-primary">
                    Change your hashnode.dev blog URL to a custom domain of your
                    choice for free!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* main dashboard navigations */}
          <div className="flex gap-4">
            <div className="w-[18rem] overflow-hidden rounded-md bg-white py-2 dark:bg-primary">
              {dashboardNavigations.map((dashboard, index) => (
                <div
                  key={dashboard.id}
                  // the className logic is just to add margings in divider navigations.
                  // You can see the navigations is divided into 3 parts. so to add margin in between them, I have added this logic
                  className={`
                    ${
                      index === 2 ||
                      index === 5 ||
                      index === 11 ||
                      index === 13 ||
                      index === 15
                        ? "mb-2 border-b border-border-light dark:border-border"
                        : ""
                    }
                    `}
                >
                  <Link
                    href={`/${session?.user.id as string}${dashboard.link}`}
                  >
                    <div
                      className={`flex w-full cursor-pointer items-center gap-2 px-6 py-4 hover:bg-gray-200 dark:hover:bg-primary-light
                      ${
                        index === 2 ||
                        index === 5 ||
                        index === 11 ||
                        index === 13 ||
                        index === 15
                          ? "mb-2"
                          : ""
                      }`}
                    >
                      {dashboard.icon}
                      <span className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                        {dashboard.name}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="min-h-[40rem] flex-1 overflow-hidden rounded-md bg-light-bg dark:bg-primary">
              {dashboardName}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)) as Session,
    },
  };
};
