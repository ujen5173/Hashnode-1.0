import People from "./../svgs/People";
import Magic from "./../svgs/Magic";
import Star from "./../svgs/Star";
import Filter from "./../svgs/Filter";
import Gridclassic from "./../svgs/Gridclassic";

const MainBodyHeader = () => {
  return (
    <header className="w-full overflow-auto border-b border-border-light pt-2 dark:border-border">
      <div className="flex w-full items-end justify-between gap-16 px-2">
        <div className="flex items-center gap-2">
          <button aria-label="icon" role="button" className="btn-tab">
            <Magic className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
            <span className="text-sm font-semibold">Personalized</span>
          </button>
          <button aria-label="icon" role="button" className="btn-tab">
            <People className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-primary" />
            <span className="text-sm font-semibold">Following</span>
          </button>
          <button aria-label="icon" role="button" className="btn-tab">
            <Star className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
            <span className="text-sm font-semibold">Featured</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="icon"
            role="button"
            className="btn-icon-small flex items-center justify-center"
          >
            <Filter className="h-4 w-4 fill-gray-700 dark:fill-text-primary" />
          </button>
          <button
            aria-label="icon"
            role="button"
            className="btn-tab flex items-center gap-2"
          >
            <Gridclassic className="h-4 w-4 fill-none stroke-gray-700 dark:stroke-text-primary" />
            <span>View</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainBodyHeader;
