const NotificationLoading = () => {
  return (
    <div className="flex w-full flex-wrap gap-3 py-3">
      <div className="loading h-14 w-14 rounded-full bg-border-light dark:bg-border" />
      <div className="flex-1">
        <div className="loading mb-2 h-4 w-full rounded-full bg-border-light dark:bg-border" />
        <div className="loading mb-2 h-4 w-6/12 rounded-full bg-border-light dark:bg-border" />
      </div>
    </div>
  );
};

export default NotificationLoading;
