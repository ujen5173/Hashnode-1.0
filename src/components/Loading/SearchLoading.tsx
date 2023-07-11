const SearchLoading = () => {
  return (
    <div className="h-64 flex-1 ">
      <div className="border-b border-border-light p-4 last:border-0 dark:border-border">
        <div className="loading mb-2 h-5 w-8/12 rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-5 w-6/12 rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-5 w-3/12 rounded-full bg-border-light dark:bg-border" />
      </div>
      <div className="border-b border-border-light p-4 last:border-0 dark:border-border">
        <div className="loading mb-2 h-5 w-8/12 rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-5 w-6/12 rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-5 w-3/12 rounded-full bg-border-light dark:bg-border" />
      </div>
    </div>
  );
};

export default SearchLoading;
