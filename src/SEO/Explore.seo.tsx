import Head from "next/head";

const ExploreSEO = () => {
  return (
    <Head>
      <title>Explore Popular Tech Blogs and Topics - Hashnode Clone</title>
      <meta
        property="og:title"
        content="Explore Popular Tech Blogs and Topics - Hashnode Clone"
      />
      <meta
        name="description"
        content="Explore the most popular tech blogs from the Hashnode community. A constantly updating list of the best minds in tech."
      />

      {/* Open Graph tags for social media banner */}
      <meta
        property="og:title"
        content="Explore Popular Tech Blogs and Topics - Hashnode Clone"
      />
      <meta
        property="og:description"
        content="Explore the most popular tech blogs from the Hashnode community. A constantly updating list of the best minds in tech."
      />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta property="og:url" content="https://hashnode.vercel.app" />

      {/* Twitter card tags for Twitter banner */}
      <meta
        name="twitter:title"
        content="Explore Popular Tech Blogs and Topics - Hashnode Clone"
      />
      <meta name="twitter:description" content="Your page description" />
      <meta property="twitter:image" content="/hashnode-social-banner.png" />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Other necessary tags */}
      <link rel="canonical" href="https://hashnode.vercel.app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Image tags */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
  );
};

export default ExploreSEO;
