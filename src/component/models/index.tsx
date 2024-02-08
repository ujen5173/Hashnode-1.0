const Model = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: () => Promise<void>;
}) => {
  return (
    <div className="w-vw h-vh fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/75 backdrop-blur" />
      <div className="z-[55] rounded-md border border-border-light bg-primary p-6 shadow-md dark:border-border">
        <header className="mb-4 border-b border-border-light py-2 dark:border-border">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-text-secondary">
            {title}
          </h1>
        </header>
        <p className="mb-6 text-base text-gray-900 dark:text-text-primary">
          {description}
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => void action()}
            className="mr-2 rounded-md bg-red px-4 py-2 text-white"
          >
            Delete
          </button>
          <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;
