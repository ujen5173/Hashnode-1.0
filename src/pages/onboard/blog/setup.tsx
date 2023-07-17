import { TRPCClientError } from "@trpc/client";
import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { authOptions } from "~/server/auth";
import { Logo } from "~/svgs";
import { api } from "~/utils/api";

const Setup = () => {
  const [subdomain, setSubdomain] = useState("");
  const { mutateAsync, isLoading } =
    api.handles.createPersonalHandle.useMutation();

  const handleSubdomain = async () => {
    if (subdomain.length > 0) {
      try {
        const data = await mutateAsync({
          handle: subdomain,
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

      <div className="min-h-screen w-full bg-white dark:bg-black">
        <div className="mx-auto max-w-[900px] px-4 py-16">
          <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-text-secondary">
            Where do you want this blog to be located?
          </h1>

          <div className="mb-6 rounded-md border border-border-light bg-light-bg p-4 dark:border-border dark:bg-primary">
            <h1 className="mb-2 text-base font-semibold text-gray-700 dark:text-text-secondary">
              Hashnode Clone’s subdomain
            </h1>
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              type="text"
              placeholder="Search for a subdomain"
              className="w-full rounded-full border border-border-light bg-light-bg px-4 py-3 text-sm outline-none dark:border-border dark:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <button className="btn-outline">
              <div className="px-4">
                <span className="text-gray-100">Back</span>
              </div>
            </button>
            <button
              onClick={() => void handleSubdomain()}
              className={`${
                isLoading ? "cursor-not-allowed opacity-40" : ""
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
