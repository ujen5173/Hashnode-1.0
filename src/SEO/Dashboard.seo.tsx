import { useSession } from "next-auth/react";
import Head from "next/head";

const DashboardSEO = () => {
  const { data: user } = useSession();
  return (
    <Head>
      <title>Dashboard - Hashnode Clone</title>
      <meta name="description" content={`Dashboard on Hashnode Clone`} />

      {/* Open Graph tags for social media banner */}
      <meta property="og:title" content={`Dashboard - Hashnode Clone`} />
      <meta property="og:description" content={`Dashboard on Hashnode Clone`} />
      <meta property="og:site_name" content={user?.user.name || ""}></meta>
      <meta property="og:type" content="user"></meta>
      <meta
        property="og:image"
        content={user?.user.profile || "/default_user?.user.avif"}
      />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_VERCEL_URL as string}/u/@${
          user?.user.username || ""
        }`}
      />

      {/* Twitter card tags for Twitter banner */}
      <meta name="twitter:title" content={`Dashboard - Hashnode Clone`} />
      <meta
        name="twitter:description"
        content={`Dashboard on Hashnode Clone`}
      />
      <meta
        property="twitter:image"
        content={user?.user.profile || "/default_user?.user.avif"}
      />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Other necessary tags */}
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_VERCEL_URL as string}/u/@${
          user?.user.username || ""
        }`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Image tags */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
  );
};

export default DashboardSEO;
