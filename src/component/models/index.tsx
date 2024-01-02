
const Model = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: () => Promise<void>
}) => {
  console.log("hi")
  return (
    <div className="z-50 w-vw h-vh fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/75 backdrop-blur" />
      <div className="z-[55] bg-primary rounded-md border border-border-light dark:border-border shadow-md p-6">
        <header className="border-b mb-4 border-border-light dark:border-border py-2">
          <h1 className="text-xl text-gray-900 dark:text-text-secondary font-semibold">{title}</h1>
        </header>
        <p className="text-base text-gray-900 dark:text-text-primary mb-6">{description}</p>
        <div className="flex justify-end">
          <button onClick={
            () => void action()
          } className="bg-red text-white px-4 py-2 rounded-md mr-2">Delete</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Model