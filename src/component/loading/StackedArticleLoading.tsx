
const StackedArticleLoading = () => {
  return (
    <div className="flex items-center flex-1 my-4">
      <div className="flex-1">
        <div className="loading h-4 mb-2 w-10/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading h-4 mb-2 w-8/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading h-4 mb-2 w-6/12 rounded-md bg-border-light dark:bg-border"></div>
        <div className="loading h-4 mb-2 w-4/12 rounded-md bg-border-light dark:bg-border"></div>
      </div>
      <div className="w-1/6">
        <div className="loading h-28 w-full rounded-md bg-border-light dark:bg-border"></div>
      </div>
    </div>
  )
}

export default StackedArticleLoading
