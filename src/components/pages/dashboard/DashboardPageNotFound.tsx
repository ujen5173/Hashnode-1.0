import { useRouter } from "next/router";

const DashboardPageNotFound = () => {
  const router = useRouter();
  const handleRoute = () => {
    if (typeof router.query.id === "string") {
      void router.push(`/${router.query.id}/dashboard/general`);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-3xl font-semibold text-gray-700 dark:text-text-secondary">
        404 | Section Not Found
      </h1>

      <button onClick={() => void handleRoute()} className="btn-filled">
        Go to General
      </button>
    </div>
  );
};

export default DashboardPageNotFound;
