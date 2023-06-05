import ArticleCard from "./Cards/ArticleCard";
// import { articles } from "~/utils/constants";
import MainBodyHeader from "./MainBodyHeader";
import { api } from "~/utils/api";
import ArticleLoading from "./Loading/ArticleLoading";

const MainBodyArticles = () => {
  const { data, isLoading } = api.posts.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <section className="container-main my-4 min-h-screen w-full rounded-md border border-border-light bg-white dark:border-border dark:bg-primary">
      <MainBodyHeader />

      <div>
        {isLoading ? (
          <>
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
            <ArticleLoading />
          </>
        ) : (
          data?.map((card) => <ArticleCard key={card.id} card={card} />)
        )}
      </div>
    </section>
  );
};

export default MainBodyArticles;
