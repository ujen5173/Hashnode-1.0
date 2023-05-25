import { drafts } from "~/utils/constants";
import DraftCard from "./Cards/DraftCard";

const Drafts = () => {
  return (
    <div className="my-4 rounded-md border border-border-light bg-white p-4 dark:border-border dark:bg-primary">
      <header className="flex items-center justify-between border-b border-border-light py-2 dark:border-border">
        <h1 className="text-xl font-bold text-gray-700 dark:text-text-secondary">
          Drafts(1)
        </h1>
        <button
          aria-label="view all your unpublished drafts."
          role="button"
          className="btn-outline-small"
        >
          See all
        </button>
      </header>

      <div>
        {drafts.map((draft) => (
          <DraftCard key={draft.id} draft={draft} />
        ))}
      </div>
    </div>
  );
};

export default Drafts;
