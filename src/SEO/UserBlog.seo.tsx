import React from "react";
import Head from "next/head";

const UserBlogSEO = () => {
  return (
    <Head>
      <title>A Chapter Lead&apos;s blog</title>
      <meta property="og:title" content="A Chapter Lead's blog" />
      <meta name="description" content="A Chapter Lead's blog" />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content="A Chapter Lead's blog" />
      <meta property="og:description" content="A Chapter Lead's blog" />
      <meta property="og:image" content="/hashnode-social-banner.png" />
      <meta property="og:url" content="https://hashnode.vercel.app" />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content="A Chapter Lead's blog" />
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

export default UserBlogSEO;
