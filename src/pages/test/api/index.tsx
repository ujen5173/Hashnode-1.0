import articles from "@/data/articles.json";
import Head from "next/head";
import { api } from "~/utils/api";

const ApiTesting = () => {
  const { mutateAsync } = api.posts.new.useMutation();

  const launch = async () => {
    articles.forEach(async (article) => {
      const res = await mutateAsync({
        ...article,
        edit: false,
      });
      console.log(res)
    });
  }
  return (
    <>
      <Head>
        <title>Drizzle Api Testing!!</title>
      </Head>
      <div className="gap-2 flex items-center justify-center min-h-screen">
        <button onClick={() => void launch()} className="btn-tertiary">LAUNCH</button>
      </div>
    </>
  )
};

export default ApiTesting;
