import { eq } from "drizzle-orm";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import {
  Account,
  EmailNotification,
  Header,
  ManageBlogs,
  Subscription,
  UserDetailsOptions,
  UserProfile,
} from "~/component";
import MetaTags from "~/component/MetaTags";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { type UserDetails } from "~/types";

const EditProfile: NextPage<{
  user: UserDetails;
}> = ({ user }) => {
  const { tab } = useRouter().query;

  return (
    <>
      <MetaTags
        title={`
          ${user.name} (@${user.username})
        `}
        description={user.tagline}
      />
      <Header />

      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="container mx-auto py-6">
          <div className="flex w-full flex-col lg:flex-row">
            <div className="w-full lg:w-80 lg:pl-0 lg:pr-4">
              <div className="mb-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
                <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                  User Details
                </h1>
              </div>

              <UserDetailsOptions />
            </div>

            <main className="my-4 min-h-[100dvh] flex-1 rounded-md border border-border-light bg-white px-4 py-6 dark:border-border dark:bg-primary sm:p-6 md:p-8 lg:my-0">
              {
                {
                  default: <UserProfile user={user} />,
                  account: <Account />,
                  "email-notification": <EmailNotification />,
                  "manage-blogs": <ManageBlogs />,
                  pro: <Subscription />,
                }[tab ? tab[0]! : "default"]
              }
            </main>
          </div>
        </div>
      </main>
    </>
  );
};

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user) {
    return {
      props: { session: null, user: null },
      redirect: { destination: "/" },
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session?.user.id),
    columns: {
      name: true,
      tagline: true,
      image: true,
      location: true,
      bio: true,
      skills: true,
      cover_image: true,
      available: true,
      social: true,
      username: true,
      email: true,
    },
  });

  let newUser = {
    ...user,
    skills: user?.skills?.map((e) => e.trim()).join(", ") ?? "",
  };

  if (!user?.social) {
    newUser = {
      ...newUser,
      social: {
        twitter: "",
        instagram: "",
        github: "",
        stackoverflow: "",
        facebook: "",
        website: "",
        linkedin: "",
        youtube: "",
      },
    };
  }

  if (user === null || user === undefined) {
    return {
      redirect: {
        destination: "/onboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(newUser)) as UserDetails,
    },
  };
};
