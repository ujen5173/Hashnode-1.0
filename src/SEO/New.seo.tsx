import React from "react";
import Head from "next/head";

const NewSEO = () => {
  return (
    <Head>
      <title>New Article - Hashnode Clone</title>
      <meta property="og:title" content="New Article - Hashnode Clone" />
      <meta
        name="description"
        content="Share your knowledge and experiences with the community."
      />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content="New Article - Hashnode Clone" />
      <meta
        property="og:description"
        content="Share your knowledge and experiences with the community."
      />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta property="og:url" content="https://hashnode.vercel.app" />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content="New Article - Hashnode Clone" />
      <meta
        name="twitter:description"
        content="Share your knowledge and experiences with the community"
      />
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

export default NewSEO;
