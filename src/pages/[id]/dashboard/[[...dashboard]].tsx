import { type GetServerSideProps } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Appearance,
  Articles,
  CreateNewSeries,
  DashboardPageNotFound,
  General,
  Header,
  Navbar,
  Pages,
  Series
} from "~/component";
import { Navigation } from "~/component/macroComponent/Dashboard";
import DashboardSEO from "~/SEO/Dashboard.seo";
import { authOptions } from "~/server/auth";
import {
  BlankCircle,
  BoardedDownArrow,
  CheckFilled,
  Customize,
  Global,
  LogonoText,
  Pen,
  Redirect,
} from "~/svgs";
import { api } from "~/utils/api";

// All dashboard navigations
const componentMap = {
  general: <General />,
  appearance: <Appearance />,
  navbar: <Navbar />,
  articles: <Articles />,
  series: <Series />,
  pages: <Pages />,
  // sponsors: <Sponsors />,
  // analytics: <Analytics />,
  // widgets: <Widgets />,
  // newsletter: <Newsletter />,
  // integrations: <Integrations />,
  // seo: <SEO />,
  // domain: <Domain />,
  // gitHub: <GitHub />,
  // import: <Import />,
  // export: <Export />,
  // advanced: <Advanced />,
  "series/create": <CreateNewSeries />,
  "404": <DashboardPageNotFound />,
};

const upCommingComponents = [
  "sponsors",
  "analytics",
  "widgets",
  "newsletter",
  "integrations",
  "seo",
  "domain",
  "gitHub",
  "import",
  "export",
  "pages",
  "github",
  "advanced",
]

const Dashboard = () => {
  const paths = useRouter().query;
  const { data: session } = useSession();


  const [dashboardName, setDashboardName] = useState<React.ReactNode>(
    componentMap.general
  );

  useEffect(() => {
    // set dashboard component based on the path. if path is incorrect, set 404 component else set respective component and if path is undefined, set general component
    setDashboardName(upCommingComponents.includes(
      (paths?.dashboard as string[])?.join("/") ?? "general"
    ) ? (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl mb-2 font-semibold text-gray-700 dark:text-text-secondary">
          {`🚧 ${(
            paths?.dashboard as string[]
          )?.join("/").charAt(0).toUpperCase() + (
            paths?.dashboard as string[]
          )?.join("/")?.slice(1)
            } is under construction`}
        </h1>

        <p className="text-sm text-gray-500 dark:text-text-primary">
          We are working on it. Please check back later.
        </p>
      </div>
    ) : componentMap[
    Object.keys(componentMap).includes(
      (paths?.dashboard as string[])?.join("/") ?? "general"
    )
      ? ((paths?.dashboard as string[])?.join(
        "/"
      ) as keyof typeof componentMap) ?? "general"
      : "404"
    ]
    );
  }, [paths.dashboard]);

  return (
    <>
      <DashboardSEO />

      <Header search={false} />

      <div className="bg-light-bg dark:bg-black">
        <div className="mx-auto max-w-[1550px] gap-4 py-8 sm:px-4">
          <header className="mb-6 flex w-full flex-col items-center justify-between rounded-md border border-border-light bg-white px-6 py-8 dark:border-border dark:bg-primary sm:flex-row">
            <div className="mb-4 flex w-full max-w-[20rem] cursor-pointer items-center justify-between rounded-full border border-border-light bg-light-bg px-4 py-2 hover:bg-border-light dark:border-border dark:bg-primary-light dark:hover:bg-border sm:mb-0">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-white p-1">
                  <LogonoText className="h-6 w-6 fill-secondary" />
                </div>

                <h1 className="text-base font-semibold text-gray-700 dark:text-text-secondary md:text-lg md:font-bold">
                  {session?.user.handle?.name === session?.user.name
                    ? `${session?.user.handle?.name as string}' Blog`
                    : session?.user.handle?.name}
                </h1>
              </div>

              <button>
                <BoardedDownArrow className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Link href={`/dev/@${session?.user?.handle?.handle as string}`}>
                <div className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-200 dark:hover:bg-primary-light">
                  <Redirect className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />

                  <span className="font-medium text-gray-600 dark:text-text-primary">
                    Visit Blog
                  </span>
                </div>
              </Link>
            </div>
          </header>

          <Roadmap />

          {/* main dashboard navigations */}
          <main className="flex flex-col gap-4 md:flex-row">
            <Navigation paths={paths} userId={session?.user.id as string} />
            {/* dashboard component */}
            <section className="relative min-h-[40rem] w-full flex-1 overflow-hidden rounded-md border border-border-light bg-white px-4 py-6 dark:border-border dark:bg-primary md:px-6 md:py-8 lg:p-8">
              {dashboardName}
            </section>
          </main>
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
      props: { session: null },
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  if (session.user.id !== context.params?.id) {
    return {
      props: { session: null },
      redirect: {
        destination: `/`,
        permanent: true,
      },
    };
  }

  if (session.user.handle === null) {
    return {
      props: { session: null },
      redirect: {
        destination: "/onboard/blog/setup",
        parmanent: true,
      },
    };
  }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)) as Session,
    },
  };
};

const Roadmap = () => {
  const router = useRouter();
  const { data: user } = useSession();
  const { data } = api.users.getUserDashboardRoadmapDetails.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <section className="mb-6 w-full rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <h1 className="mb-4 text-base font-semibold text-gray-700 dark:text-text-secondary">
        Welcome to your new blog! What&apos;s next?
      </h1>

      <div className="flex flex-wrap gap-4">
        <div
          onClick={() => {
            if (data?.articles && data?.articles.length > 0) {
              return;
            } else {
              void router.push("/article/new");
            }
          }}
          className="relative flex w-full cursor-pointer items-center gap-4 rounded-md border border-border-light px-4 py-8 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]"
        >
          <div className="absolute right-3 top-3 md:right-4 md:top-4">
            <Pen className="h-5 w-5 fill-none stroke-gray-500 dark:stroke-text-primary" />
          </div>

          {data?.articles && data?.articles.length > 0 ? (
            <CheckFilled className="h-5 w-5 fill-green md:h-7 md:w-7" />
          ) : (
            <BlankCircle className="h-5 w-5 fill-gray-500 dark:fill-text-primary md:h-7 md:w-7" />
          )}

          <div className="flex-1">
            <h1 className="mb-2  text-xl font-semibold text-secondary">
              Write your first article
            </h1>

            <p className="text-sm text-gray-500 dark:text-text-primary md:text-base">
              Share your thoughts, and connect with the community by writing
              your first article.
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            if (data?.articles && data?.articles.length > 0) {
              return;
            } else {
              const appearanceLocation = `/${user?.user.id as string
                }/dashboard/appearance`;

              void router.push(appearanceLocation);
            }
          }}
          className="relative flex w-full cursor-pointer items-center gap-4 rounded-md border border-border-light px-4 py-8 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]"
        >
          <div className="absolute right-3 top-3 md:right-4 md:top-4">
            <Customize className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
          </div>

          {data?.handle?.appearance ? (
            <CheckFilled className="h-5 w-5 fill-green md:h-7 md:w-7" />
          ) : (
            <BlankCircle className="h-5 w-5 fill-gray-500 dark:fill-text-primary md:h-7 md:w-7" />
          )}
          <div className="flex-1">
            <h1 className="mb-2 text-xl  font-semibold text-secondary">
              Customizing the appearance
            </h1>

            <p className="text-sm text-gray-500 dark:text-text-primary md:text-base">
              Personalize the design of your blog and showcase your personality.
            </p>
          </div>
        </div>

        <div className="relative flex w-full cursor-pointer items-center gap-4 rounded-md border border-border-light px-4 py-8 hover:bg-light-bg dark:border-border dark:hover:bg-primary-light md:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]">
          <div className="absolute right-3 top-3 md:right-4 md:top-4">
            <Global className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
          </div>

          <CheckFilled className="h-5 w-5 fill-green md:h-7 md:w-7" />

          <div className="flex-1">
            <h1 className="mb-2 text-xl  font-semibold text-secondary">
              Map a custom domain
            </h1>

            <p className="text-sm text-gray-500 dark:text-text-primary md:text-base">
              Change your hashnode.dev blog URL to a custom domain of your
              choice for free!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
