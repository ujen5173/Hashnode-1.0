const SimpleArticleCardLoading = () => {
  return (
    <div className="w-full rounded-md border border-border-light p-4 dark:border-border md:w-[calc(100%/2-0.5rem)]">
      <div className="loading mb-4 h-44 w-full rounded-md bg-border-light dark:bg-border"></div>

      <div>
        <div className="loading mb-4 h-6 w-11/12 rounded-md bg-border-light dark:bg-border"></div>

        <div className="mb-4 flex items-center gap-2">
          <div className="loading h-4 w-16 rounded-md bg-border-light dark:bg-border"></div>
          <div className="loading h-4 w-16 rounded-md bg-border-light dark:bg-border"></div>
        </div>

        <div className="loading mb-2 h-4 w-9/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading mb-2 h-4 w-7/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading mb-2 h-4 w-4/12 rounded-md bg-border-light dark:bg-border"></div>
      </div>
    </div>
  );
};

export default SimpleArticleCardLoading;
