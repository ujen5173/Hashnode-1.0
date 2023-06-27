import Head from "next/head";
import { useRouter } from "next/router";

interface SeoData {
  [key: string]: {
    title: string;
    description: string;
  };
}

const ExploreSEO: React.FC = () => {
  const slug = useRouter().query.slug as string[] | undefined;
  const seoData: SeoData = {
    tags: {
      title: "Explore Tags - Hashnode Clone",
      description:
        "Explore the most popular tech trends, topics, and tags from the Hashnode community. A constantly updating list.",
    },
    "tags-following": {
      title: "Tags you follow - Hashnode Clone",
      description: "Tags you follow - Hashnode",
    },
    articles: {
      title: "Explore Trending Articles - Hashnode Clone",
      description:
        "A constantly updating list of best and popular tech blogs from the Hashnode dev community. Follow tech blogs you like.",
    },
    "articles-following": {
      title: "Explore Following Articles - Hashnode Clone",
      description: "Articles you follow - Hashnode",
    },
  };

  const defaultSeoData: { title: string; description: string } = {
    title: "Explore Popular Tech Blogs and Topics - Hashnode Clone",
    description:
      "A constantly updating list of best and popular tech blogs from the Hashnode dev community. Follow tech blogs you like.",
  };

  const pageTitle: string =
    !slug || !slug[0] || !seoData[slug[0]]
      ? "Explore Popular Tech Blogs and Topics - Hashnode Clone"
      : seoData[slug[0]]?.title ||
        "Explore Popular Tech Blogs and Topics - Hashnode Clone";

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name="description"
        content={
          seoData["/explore/articles"]?.description ||
          defaultSeoData.description
        }
      />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content={pageTitle} />
      <meta
        property="og:description"
        content={
          seoData["/explore/articles"]?.description ||
          defaultSeoData.description
        }
      />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={process.env.NEXT_PUBLIC_VERCEL_URL as string}
      />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content={pageTitle} />
      <meta
        name="twitter:description"
        content={
          seoData["/explore/articles"]?.description ||
          defaultSeoData.description
        }
      />
      <meta property="twitter:image" content="/hashnode-social-banner.png" />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Other necessary tags */}
      <link
        rel="canonical"
        href={process.env.NEXT_PUBLIC_VERCEL_URL as string}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Image tags */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
  );
};

export default ExploreSEO;
