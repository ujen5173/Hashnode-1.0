import Head from "next/head";
import { type FC } from "react";
import { type User } from "~/types";

const UserBlogSEO: FC<{ user: User }> = ({ user }) => {
  return (
    <Head>
      <title>{`${user.name || ""}'s Blog`}&apos;s blog</title>
      <meta name="description" content={user.name || ""} />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content={user.name || ""} />
      <meta property="og:description" content={user.name || ""} />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta
        property="og:url"
        content={process.env.NEXT_PUBLIC_VERCEL_URL as string}
      />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content={user.name || ""} />
      <meta name="twitter:description" content={user.name || ""} />
      <meta
        property="twitter:image"
        content={user.profile || "/default_user.avif"}
      />
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

export default UserBlogSEO;
