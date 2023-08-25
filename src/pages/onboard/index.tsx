import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Divider } from "~/component";
import { Google, Logo } from "~/svgs";

const Onboard = () => {
  return (
    <>
      <header className="flex items-center justify-center border-b border-border-light bg-white p-4 dark:border-border dark:bg-primary">
        <Link href="/">
          <Logo className="h-9 fill-secondary" />
        </Link>
      </header>

      <main className="min-h-[100dvh] bg-light-bg dark:bg-black">
        <div className="mx-auto flex max-w-[1440px] gap-0 px-4 py-28 md:gap-8 lg:gap-20 xl:gap-28">
          <div className="flex w-full flex-col justify-center">
            <h1 className="mx-auto mb-5 items-center text-3xl font-semibold text-secondary">
              Sign up / Log in
            </h1>

            <div className="mb-5 flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  void signIn("google", {
                    callbackUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
                  })
                }
                className="btn-oauth w-full lg:w-auto"
              >
                <Google className="h-5 w-5 fill-gray-700 dark:fill-white" />
                <span>Continue with Google</span>
              </button>
              {/* <button
                onClick={() =>
                  void signIn("github", {
                    callbackUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
                  })
                }
                className="btn-oauth w-full lg:w-auto"
              >
                <Github className="h-5 w-5 fill-gray-700 dark:fill-white" />
                <span>Continue with Github</span>
              </button> */}
            </div>

            <Divider />

            <div className="my-5 flex flex-col items-center">
              <label
                htmlFor="magic_link"
                className="mb-3 inline-block text-lg font-medium text-gray-700 dark:text-text-secondary"
              >
                Or sign in using a magic link
              </label>

              <input
                type="email"
                placeholder="johndoe@example.com"
                id="magic_link"
                className="input-oauth mb-3"
              />

              <button className="btn-filled-large w-4/12">Submit</button>
            </div>
          </div>
          <div className="hidden w-full md:block md:w-7/12 xl:w-full">
            <i className="mb-2 block text-lg text-gray-700 dark:text-text-secondary">
              &quot;It&apos;s amazing to see how fast devs go from 0 to Blog
              under a domain they own on Hashnode 🤯. It reminds me a lot of
              what Substack did for journalists.&quot;
            </i>

            <div className="flex items-center gap-2">
              <Image
                src={
                  "https://cdn.hashnode.com/res/hashnode/image/upload/v1645091032744/UERdc-IVr.jpeg?auto=compress"
                }
                width={70}
                height={70}
                alt="CEO Profile"
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
                  Ujen Basi
                </h1>
                <p className="text-sm font-normal text-gray-500 dark:text-text-primary">
                  CEO, Google
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Onboard;
