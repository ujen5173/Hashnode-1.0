import Head from "next/head";
import React, { useMemo } from "react";
import { baseUrl } from "~/utils/constants";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const MetaTags: React.FC<Props> = ({
  title,
  description,
  url = baseUrl,
  image,
}) => {
  const formattedTitle = useMemo(() => {
    const defaultTitle = `Hashnode Clone`;

    if (title) {
      return `${title} | ${defaultTitle}`;
    }

    return defaultTitle;
  }, [title]);

  const DEFAULT_DESCRIPTION =
    "Hashnode Clone is a clone of free developer blogging platform that allows you to publish articles on your own domain and helps you stay connected with a global developer community.";
  const LOGO_PATH = `${baseUrl}/static/og_image.jpg`;
  const favicon = `${baseUrl}/static/favicon.ico`;

  const currentDescription = description ?? DEFAULT_DESCRIPTION;

  return (
    <Head>
      <title>{formattedTitle}</title>
      <link rel="icon" href={favicon} />
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={currentDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={image ?? LOGO_PATH} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={currentDescription} />
      <meta property="twitter:image" content={image ?? LOGO_PATH} />
    </Head>
  );
};

export default MetaTags;
