import { useSession } from "next-auth/react";

const ManageBlogs = () => {
  const { data: session } = useSession();
  return (
    <>
      <header className="pb-4 border-b border-border-light dark:border-border">
        <h1 className="text-gray-700 dark:text-text-secondary text-xl font-semibold">
          My blogs
        </h1>
      </header>

      <main className="py-4">
        <table className="table w-full table-auto border-separate border-spacing-0 border border-border-light dark:border-border rounded-lg overflow-hidden">
          <thead>

            <tr className="text-sm text-left bg-slate-100 dark:bg-primary-light">
              <th scope="col" className="px-6 py-3.5 rounded-tl-lg font-bold text-slate-600 dark:text-slate-300">Blogs</th>
              <th scope="col" className="px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">Blog Type</th>
              <th scope="col" className="px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"><span>Role</span></th>
              <th scope="col" className="px-6 py-3.5 rounded-tr-lg font-bold text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-sm text-left">
              <th scope="col" className="px-6 py-3.5 rounded-tl-lg">
                <h1 className="text-base font-semibold mb-1 text-slate-600 dark:text-slate-300">{session?.user.handle?.name}</h1>
                <p className="text-gray-500 dark:text-text-primary text-sm font-normal">{session?.user.handle?.handle}.hashnode-t3.dev</p>
              </th>
              <th scope="col" className="px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">Personal</th>
              <th scope="col" className="px-6 py-3.5 font-bold text-slate-600 dark:text-slate-300"><span>Owner</span></th>
              <th scope="col" className="px-6 flex-wrap py-3.5 rounded-tr-lg flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                <button className="px-4 py-2 rounded-md bg-secondary hover:bg-twitterColor text-white shadow-md outline-none font-medium text-sm">
                  Manage
                </button>
                <button className="px-4 py-2 rounded-md bg-red hover:bg-[#f10707] text-white shadow-md outline-none font-medium text-sm">
                  Delete Blog
                </button>
              </th>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}

export default ManageBlogs