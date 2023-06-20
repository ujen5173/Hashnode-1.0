import { type GetServerSideProps, type NextPage } from "next";
import { getServerSession, type Session } from "next-auth";
import React, { useContext, useEffect, useState } from "react";
import {
  BasicInfo,
  Header,
  SocialInfo,
  UserDetailsOptions,
} from "~/components";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { useSession } from "next-auth/react";
import { C, type ContextValue } from "~/utils/context";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { z } from "zod";
import SettingsSEO from "~/SEO/Settings.seo";

export interface UserDetails {
  name: string;
  username: string;
  email: string;
  location: string;
  profile: string;
  tagline: string;
  available: string;
  cover_image: string;
  bio: string;
  skills: string;
  social: SocialHandles;
}

export interface SocialHandles {
  twitter: string;
  instagram: string;
  github: string;
  stackoverflow: string;
  facebook: string;
  website: string;
  linkedin: string;
  youtube: string;
}

const EditProfile: NextPage<{
  user: UserDetails;
}> = ({ user }) => {
  const { data: userData } = useSession();
  const { setUser } = useContext(C) as ContextValue;
  const { mutateAsync, isLoading } = api.users.updateUser.useMutation();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

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
      schema.parse(data);
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
        const url = data.social[handle];
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
    } catch (error) {
      if (error instanceof z.ZodError && error.errors[0]) {
        toast.error(error.errors[0].message);
      }
    }

    const res = await mutateAsync({
      ...data,
      skills: data.skills.split(",").map((e) => e.trim()),
      social: data.social,
    });

    toast.success("Profile Updated Successfully");
    setData(res.data);
  };

  return (
    <>
      <SettingsSEO />
      <Header />
      <main className="min-h-screen w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 px-4">
          <div className="container-aside relative hidden min-h-screen py-4 lg:block">
            <div className="mb-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
              <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                User Details
              </h1>
            </div>
            <UserDetailsOptions />
          </div>
          <main className="container-full-main my-4 min-h-screen rounded-md border border-border-light bg-white p-10 dark:border-border dark:bg-primary">
            <div className="flex gap-8">
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
          </main>
        </div>
      </main>
    </>
  );
};

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

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
