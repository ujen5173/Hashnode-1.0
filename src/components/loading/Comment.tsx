const CommentsLoading = () => {
  return (
    <div className="border-b border-border-light p-4 last:border-0 dark:border-border">
      <div className="mb-4 flex gap-2">
        <div className="loading h-10 w-10 rounded-full bg-border-light dark:bg-border" />
        <div>
          <div className="loading mb-2 h-3 w-36 rounded-full bg-border-light dark:bg-border" />
          <div className="loading h-3 w-48 rounded-full bg-border-light dark:bg-border" />
        </div>
      </div>
      <div className="w-full pb-6 pt-4">
        <div className="loading mb-2 h-3 w-full rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-3 w-full rounded-full bg-border-light dark:bg-border" />
        <div className="loading h-3 w-full rounded-full bg-border-light dark:bg-border" />
      </div>
    </div>
  );
};

export default CommentsLoading;
