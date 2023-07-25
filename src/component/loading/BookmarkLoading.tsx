const BookmarkLoading = () => {
  return (
    <div className="border-b border-border-light py-4 last:border-0 dark:border-border">
      <div className="loading mb-2 h-3 w-11/12 rounded-full bg-border-light dark:bg-border" />
      <div className="loading mb-3 h-3 w-6/12 rounded-full bg-border-light dark:bg-border" />
      <div className="flex items-center gap-2">
        <div className="loading h-3 w-2/12 rounded-full bg-border-light dark:bg-border" />
        <div className="loading h-3 w-2/12 rounded-full bg-border-light dark:bg-border" />
      </div>
    </div>
  );
};

export default BookmarkLoading;
