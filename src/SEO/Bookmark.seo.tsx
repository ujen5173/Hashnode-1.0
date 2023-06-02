import React from "react";
import Head from "next/head";

const BookmarkSEO = () => {
  return (
    <Head>
      <title>Bookmarks - Hashnode Clone</title>
      <meta property="og:title" content="Bookmarks - Hashnode Clone" />
      <meta name="description" content="Bookmarks - Hashnode Clone" />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content="Bookmarks - Hashnode Clone" />
      <meta property="og:description" content="Bookmarks - Hashnode Clone" />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta property="og:url" content="https://hashnode.vercel.app" />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content="Bookmarks - Hashnode Clone" />
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

export default BookmarkSEO;
