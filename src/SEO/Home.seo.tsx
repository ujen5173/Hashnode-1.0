import Head from "next/head";

const HomeSEO = () => {
  return (
    <Head>
      <title>Hashnode Clone</title>
      <meta
        name="description"
        content="Hashnode - Blogging community for developers, and people in tech"
      />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content="Hashnode Clone" />
      <meta
        property="og:description"
        content="Hashnode - Blogging community for developers, and people in tech"
      />
      <meta property="og:site_name" content="Hashnode Clone" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta
        property="og:url"
        content={process.env.NEXT_PUBLIC_VERCEL_URL as string}
      />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content="Hashnode Clone" />
      <meta
        name="twitter:description"
        content="Hashnode - Blogging community for developers, and people in tech"
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

export default HomeSEO;
