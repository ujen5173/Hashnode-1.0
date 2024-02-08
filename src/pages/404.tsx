import Image from "next/image";
import Link from "next/link";
import MetaTags from "~/component/MetaTags";

const PageNotFound = () => {
  return (
    <>
      <MetaTags title="Oops Page not Found!" />

      <div className="bg-blue-50 dark:bg-black">
        <div className="container mx-auto flex min-h-[100dvh] flex-col items-center justify-center border-x border-border-light bg-white px-8 py-16 dark:border-border dark:bg-slate-900">
          <Image
            className="mb-8 max-h-[30rem] w-auto select-none object-cover"
            src={"/static/pageNotFound.png"}
            alt="404"
            width={500}
            draggable={false}
            height={500}
          />

          <h1 className="mb-4 text-6xl font-bold text-slate-900 dark:text-slate-100">
            404
          </h1>

          <h1 className="mb-6 text-2xl font-bold text-slate-500">
            We can&apos;t find the page you&apos;re looking for.
          </h1>

          <Link href="/">
            <button className="rounded-full border border-secondary px-4 py-2 text-base font-medium text-secondary shadow-lg outline-none hover:bg-gray-100">
              Take me home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
