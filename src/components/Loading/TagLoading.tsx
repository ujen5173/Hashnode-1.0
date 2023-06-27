const TagLoading = () => {
  return (
    <div className="loading flex h-16 w-full items-center gap-2 rounded-md border border-border-light bg-border-light p-2 dark:border-border dark:bg-border">
      <div className="loading h-12 w-12 rounded-md bg-border-light dark:bg-primary" />
      <div className="flex-1">
        <div className="loading mb-2 h-4 w-7/12 rounded-md bg-border-light dark:bg-primary"></div>
        <div className="loading h-3 w-2/6 rounded-md bg-border-light dark:bg-primary"></div>
      </div>
    </div>
  );
};

export default TagLoading;
