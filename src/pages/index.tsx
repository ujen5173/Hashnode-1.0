import { type NextPage } from "next";
import { Header, MainBody } from "~/components";
import HomeSEO from "~/SEO/Home.seo";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const data = api.example.getAll.useQuery();
  console.log({ data });
  return (
    <>
      <HomeSEO />
      <Header />
      <MainBody />
    </>
  );
};

export default Home;
