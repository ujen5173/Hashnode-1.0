import { useRouter } from "next/router";

const DashboardPageNotFound = () => {
  const router = useRouter();
  const handleRoute = async () => {
    await router.push(`/${router.query.id as string}/dashboard/general`);
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
