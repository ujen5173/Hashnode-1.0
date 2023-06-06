import React, { FC } from "react";
import Head from "next/head";
import { ArticleCard } from "~/types";

const ArticleSEO: FC<{ article: ArticleCard }> = ({ article }) => {
  return (
    <Head>
      <title>{article.title} - Hashnode Clone</title>
      <meta property="og:title" content={`${article.title} - Hashnode Clone`} />
      <meta name="description" content={`${article.content.slice(0, 30)}`} />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content={`${article.title} - Hashnode Clone`} />
      <meta
        property="og:description"
        content={`${article.content.slice(0, 30)}`}
      />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta property="og:url" content="https://hashnode.vercel.app" />

      {/* Twitter card tags for Twitter banner */}
      <meta
        name="twitter:title"
        content={`${article.title} - Hashnode Clone`}
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

export default ArticleSEO;
