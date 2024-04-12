import { useSession } from "next-auth/react";

const ManageBlogs = () => {
  const { data: session } = useSession();
  return (
    <>
      <header className="border-b border-border-light pb-4 dark:border-border">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
          My blogs
        </h1>
      </header>

      <main className="py-4">
        <table className="table w-full table-auto border-separate border-spacing-0 overflow-hidden rounded-lg border border-border-light dark:border-border">
          <thead>
            <tr className="bg-slate-100 text-left text-sm dark:bg-primary-light">
              <th
                scope="col"
                className="rounded-tl-lg px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                Blogs
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                Blog Type
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                <span>Role</span>
              </th>
              <th
                scope="col"
                className="rounded-tr-lg px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-left text-sm">
              <th scope="col" className="rounded-tl-lg px-6 py-3.5">
                <h1 className="mb-1 text-base font-semibold text-slate-600 dark:text-slate-300">
                  {session?.user.handle?.name}
                </h1>
                <p className="text-sm font-normal text-gray-500 dark:text-text-primary">
                  {session?.user.handle?.handle}.hashnode-t3.dev
                </p>
              </th>
              <th
                scope="col"
                className="whitespace-nowrap px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                Personal
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                <span>Owner</span>
              </th>
              <th
                scope="col"
                className="flex flex-wrap items-center gap-2 rounded-tr-lg px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"
              >
                <button className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white shadow-md outline-none hover:bg-twitterColor">
                  Manage
                </button>
                <button className="rounded-md bg-red px-4 py-2 text-sm font-medium text-white shadow-md outline-none hover:bg-[#f10707]">
                  Delete Blog
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
};

export default ManageBlogs;
