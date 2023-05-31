import ArticleCard from "./Cards/ArticleCard";
import { articles } from "~/utils/constants";
import MainBodyHeader from "./MainBodyHeader";

const MainBodyArticles = () => {
  return (
    <section className="my-4 min-h-screen w-full flex-[5] rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader />

      <div>
        {articles.map((card) => (
          <ArticleCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
};

export default MainBodyArticles;
