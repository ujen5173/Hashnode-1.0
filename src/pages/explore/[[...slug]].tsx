import type { NextPage } from "next";
import MainLayout from "~/components/layouts/MainLayout";
import ExploreMainComponent from "~/components/pages/explore";

const ExplorePage: NextPage = () => {
  return (
    <MainLayout
      title="Explore Popular Tech Blogs and Topics"
      description="Explore the most popular tech blogs from the Hashnode community. A constantly updating list of the best minds in tech."
    >
      <ExploreMainComponent />
    </MainLayout>
  );
};

export default ExplorePage;
