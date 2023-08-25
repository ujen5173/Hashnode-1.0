import { TRPCClientError } from "@trpc/client";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { Input } from "~/component";
import { authOptions } from "~/server/auth";
import { Logo } from "~/svgs";
import { api } from "~/utils/api";
import { slugSetting } from "~/utils/constants";

const Setup = () => {
  const { data: session } = useSession();

  const [handle, setHandle] = useState({
    name: "",
    domain: "",
  });

  useEffect(() => {
    if (session) {
      setHandle({ name: session.user.name, domain: session.user.username });
    }
  }, []);

  const { mutateAsync, isLoading } =
    api.handles.createPersonalHandle.useMutation();

  const handleSubdomain = async () => {
    if (handle.domain.length > 0) {
      try {
        const data = await mutateAsync({
          handle: handle,
        });

        if (data) {
          window.location.href = "/";
        } else {
          toast.error("Something went wrong!");
        }
      } catch (err) {
        if (err instanceof TRPCClientError) toast.error(err.message);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center border-b border-border-light bg-white p-4 dark:border-border dark:bg-primary">
        <Link href={"/"}>
          <Logo className="h-6 fill-secondary" />
        </Link>
      </div>

      <div className="min-h-[100dvh] w-full bg-white dark:bg-black">
        <div className="mx-auto max-w-[900px] px-4 py-16">
          <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-text-secondary">
            Where do you want this blog to be located?
          </h1>

          <div className="mb-6 rounded-md border border-border-light bg-light-bg px-6 py-4 dark:border-border dark:bg-primary">
            <div className="mb-4 md:mb-8">
              <Input
                input_type="text"
                name="name"
                onChange={(e) =>
                  setHandle({
                    domain: slugify(e.target.value, slugSetting),
                    name: e.target.value,
                  })
                }
                placeholder="Enter your blog name"
                type="INPUT"
                variant="FILLED"
                label="Choose a name for your blog"
                required={false}
                value={handle.name}
              />
            </div>

            <div className="relative mb-4">
              <div
                style={{
                  bottom: "14px",
                }}
                className="absolute right-4 cursor-default text-gray-500 dark:text-text-primary"
              >
                .hashndoe-t3.app
              </div>
              <Input
                input_type="text"
                name="domain"
                onChange={(e) =>
                  setHandle((prev) => ({ ...prev, domain: e.target.value }))
                }
                placeholder="Enter a domain name"
                type="INPUT"
                variant="FILLED"
                label="Choose a domain for your blog (johndoe.hashnode-t3.app)"
                required={false}
                value={handle.domain}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/">
              <button className="btn-outline">
                <div className="px-4">
                  <span className="text-gray-700 dark:text-gray-100">Back</span>
                </div>
              </button>
            </Link>

            <button
              onClick={() => void handleSubdomain()}
              className={`${isLoading ? "cursor-not-allowed opacity-40" : ""
                } btn-filled`}
              disabled={isLoading}
            >
              <div className="px-4">
                {isLoading ? "Submiting..." : "Submit"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setup;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session?.user.handle) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};
