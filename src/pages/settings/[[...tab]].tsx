import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import { useRouter } from 'next/router';
import React, { useState, type FC } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import SettingsSEO from "~/SEO/Settings.seo";
import { BasicInfo, Header, SocialInfo, UserDetailsOptions } from "~/component";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { LogonoText } from "~/svgs";
import { type SocialHandles, type UserDetails } from "~/types";
import { api } from "~/utils/api";

const EditProfile: NextPage<{
  user: UserDetails;
}> = ({ user }) => {
  const { tab } = useRouter().query;
  console.log({ tab });

  return (
    <>
      <SettingsSEO />

      <Header />

      <main className="min-h-screen w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 md:px-4">
          <div className="container-aside relative hidden min-h-screen py-4 lg:block">
            <div className="mb-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
              <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                User Details
              </h1>
            </div>

            <UserDetailsOptions />
          </div>
          <main className="container-full-main my-4 min-h-screen rounded-md border border-border-light bg-white px-4 py-6 dark:border-border dark:bg-primary sm:p-6 md:p-8 lg:p-10">
            {
              {
                default: <Settings user={user} />,
                pro: <Pro />
              }[(tab ? tab[0] : "default") as string]
            }
          </main>
        </div >
      </main >
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

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      name: true,
      tagline: true,
      profile: true,
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

  let newUser = null;

  newUser = {
    ...user,
    skills: user?.skills.map((e) => e.trim()).join(", "),
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
      session: session
        ? (JSON.parse(JSON.stringify(session)) as Session)
        : null,
      user: JSON.parse(JSON.stringify(newUser)) as UserDetails,
    },
  };
};

const Settings: FC<{ user: UserDetails }> = ({ user }) => {
  const { mutateAsync, isLoading } = api.users.updateUser.useMutation();

  const [data, setData] = useState<UserDetails>(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({
      ...data,
      social: {
        ...data.social,
        [e.target.name]: e.target.value,
      },
    });
  };

  const updateHandler = async () => {
    const schema = z.object({
      name: z.string().min(3, "Name must be atleast 3 characters long"),
      username: z.string().min(3, "Username must be atleast 3 characters long"),
      email: z.string().email("Invalid Email"),
      location: z.string().optional(),
      profile: z.string().optional(),
      tagline: z.string().optional(),
      available: z.string().optional(),
      cover_image: z.string().optional(),
      bio: z.string().optional(),
      skills: z.string().optional(),
      social: z.object({
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        github: z.string().optional(),
        stackoverflow: z.string().optional(),
        facebook: z.string().optional(),
        website: z.string().optional(),
        linkedin: z.string().optional(),
        youtube: z.string().optional(),
      }),
    });

    try {
      const dataWithSocial = {
        ...data,
        social: {
          twitter: data.social.twitter || "",
          instagram: data.social.instagram || "",
          github: data.social.github || "",
          stackoverflow: data.social.stackoverflow || "",
          facebook: data.social.facebook || "",
          website: data.social.website || "",
          linkedin: data.social.linkedin || "",
          youtube: data.social.youtube || "",
        },
      };
      schema.parse(dataWithSocial);
      const socialHandles: (keyof SocialHandles)[] = [
        "twitter",
        "instagram",
        "github",
        "stackoverflow",
        "facebook",
        "website",
        "linkedin",
        "youtube",
      ];

      for (const handle of socialHandles) {
        const url = dataWithSocial.social[handle];
        if (url !== "") {
          try {
            z.string().url().parse(url);
          } catch (error) {
            if (error instanceof Error) {
              toast.error(`Invalid URL in ${handle}`);
              return;
            }
          }
        }
      }
      const res = await mutateAsync({
        ...dataWithSocial,
        skills: dataWithSocial.skills.split(",").map((e) => e.trim()),
        social: dataWithSocial.social,
      });

      toast.success("Profile Updated Successfully");
      setData(res.data);
    } catch (error) {
      if (error instanceof z.ZodError && error.errors[0]) {
        toast.error(error.errors[0].message);
      }
    }
  };


  return (<><div className="flex flex-col gap-8 md:flex-row">
    <BasicInfo handleChange={handleChange} data={data} />

    <SocialInfo
      data={data}
      handleChange={handleChange}
      handleSocialChange={handleSocialChange}
    />
  </div>

    <button
      disabled={isLoading}
      style={{
        opacity: isLoading ? 0.5 : 1,
      }}
      className={`${isLoading ? "cursor-not-allowed" : ""} btn-filled`}
      onClick={() => void updateHandler()}
    >
      {isLoading ? "Updating..." : "Update"}
    </button>
  </>)
}

const Pro = () => {
  const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
  const { data: subscriptionStatus } = api.users.subscriptionStatus.useQuery();
  console.log(subscriptionStatus)

  const { push } = useRouter();

  const handleUpgrade = async () => {
    const { checkoutUrl } = await createCheckoutSession();
    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  }

  return (<div>
    <header className="pb-4 border-b border-border-light dark:border-border">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
        Subscription
      </h1>
    </header>

    <section className="py-4">
      {subscriptionStatus ? (
        <div className="py-4">
          <h1 className="text-2xl mb-4 font-semibold text-gray-700 dark:text-text-secondary">
            You are already subscribed to Hashnode Pro
          </h1>

          <button className="btn-filled">Manage Plans</button>
        </div>
      ) : (

        <div className="anouncement flex items-center gap-4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
          <div className="flex-1">
            <header className="mb-2 flex gap-2 items-center">
              <span className="">
                <LogonoText className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
              </span>
              <p className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                Hashnode Clone
                <span className="px-2 rounded-md bg-blue-500 text-base font-semibold text-white">PRO</span>
              </p>
            </header>

            <p className="text-sm text-gray-700 dark:text-text-secondary sm:text-base">
              Level up your publishing experience with Hahsnode Pro with powerful AI
              and premium features.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              role="button"
              onClick={() => void handleUpgrade()}
              aria-label="upgrade plan"
              className="btn-tertiary w-fit"
            >
              Upgrade now
            </button>
            <button
              role="button"
              aria-label="lean more on Hashnode pro"
              className="btn-outline w-fit text-sm text-white"
            >
              Learn more
            </button>
          </div>
        </div>
      )}

    </section>
  </div>)
}