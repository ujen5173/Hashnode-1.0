const StackedArticleLoading = () => {
  return (
    <div className="my-4 flex flex-1 items-center">
      <div className="flex-1">
        <div className="loading mb-2 h-4 w-10/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading mb-2 h-4 w-8/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading mb-2 h-4 w-6/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading mb-2 h-4 w-4/12 rounded-md bg-border-light dark:bg-border"></div>
      </div>
      <div className="w-1/6">
        <div className="loading h-28 w-full rounded-md bg-border-light dark:bg-border"></div>
      </div>
    </div>
  );
};

export default StackedArticleLoading;
