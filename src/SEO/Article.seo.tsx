import Head from "next/head";
import { type FC } from "react";
import { type Article } from "~/types";

const ArticleSEO: FC<{ article: Article }> = ({ article }) => {
  return (
    <Head>
      <title>{article.title || "Loading..."} - Hashnode Clone</title>
      <meta
        name="description"
        content={`${article.content.slice(0, 30)}`.trim()}
      />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content={`${article.title} - Hashnode Clone`} />
      <meta
        property="og:description"
        content={`${article.content.slice(0, 30)}`.trim()}
      />
      <meta property="og:site_name" content={article.user.name}></meta>
      <meta property="og:type" content="article"></meta>
      <meta
        property="og:image"
        content={article.cover_image || "/hashnode-social-banner.png"}
      />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_VERCEL_URL as string}/u/@${
          article.user.username
        }/${article.slug}`}
      />

      {/* Twitter card tags for Twitter banner */}
      <meta
        name="twitter:title"
        content={`${article.title} - Hashnode Clone`}
      />
      <meta
        name="twitter:description"
        content={`${article.title}. ${article.subtitle || ""}`.trim()}
      />
      <meta
        property="twitter:image"
        content={article.cover_image || "/hashnode-social-banner.png"}
      />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Other necessary tags */}
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_VERCEL_URL as string}/u/@${
          article.user.username
        }/${article.slug}`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Image tags */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
  );
};

export default ArticleSEO;
