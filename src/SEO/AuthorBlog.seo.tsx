import Head from "next/head";
import { type FC } from "react";

const AuthorBlog: FC<{
  author: {
    name: string;
    username: string;
    followers: { id: string }[];
  };
}> = ({ author }) => {
  return (
    <Head>
      <title>{`${author?.name || ""}'s Blog - Hashnode Clone`}</title>
      <meta name="description" content={`${author?.name || ""}&apos;s Blog`} />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content={`${author?.name || ""}&apos;s Blog`} />
      <meta
        property="og:description"
        content={`${author?.name || ""}&apos;s Blog - Hashnode Clone`}
      />
      <meta property="og:site_name" content={author?.name}></meta>
      <meta property="og:type" content="Author Blog"></meta>
      <meta property="og:image" content={"/hashnode-social-banner.png"} />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_VERCEL_URL as string}/dev/@${
          author?.username || ""
        }`}
      />

      {/* Twitter card tags for Twitter banner */}
      <meta
        name="twitter:title"
        content={`${author?.name || ""}&apos;s Blog - Hashnode Clone`}
      />
      <meta
        name="twitter:description"
        content={`${author?.name || ""}&apos;s Blog on Hashnode Clone.`}
      />
      <meta property="twitter:image" content={"/hashnode-social-banner.png"} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Other necessary tags */}
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_VERCEL_URL as string}/dev/@${
          author?.username || ""
        }`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Image tags */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
  );
};

export default AuthorBlog;
