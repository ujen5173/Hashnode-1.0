import { eq } from "drizzle-orm";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { Aside, Header, MainTagBody, RightAsideMain } from "~/component";
import MetaTags from "~/component/MetaTags";
import { authOptions } from "~/server/auth";
import { db } from "~/server/db";

import { tags, tagsToUsers } from "~/server/db/schema";
import type { DetailedTag } from "~/types";

const SingleTag: NextPage<{ tagDetails: DetailedTag }> = ({ tagDetails }) => {
  return (
    <>
      <MetaTags
        title={`
          ${tagDetails.name}${tagDetails.description ? " - " + tagDetails.description : ""}
        `}
        description={tagDetails.description}
      />
      <Header />

      <main className="min-h-[100dvh] w-full bg-light-bg dark:bg-black">
        <div className="container-body mx-auto max-w-[1550px] gap-4 px-2 sm:px-4">
          <Aside />
          <MainTagBody tagDetails={tagDetails} />
          <RightAsideMain tagDetails={tagDetails} />
        </div>
      </main>
    </>
  );
};

export default SingleTag;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const params = context.params?.slug as string;

  if (!params) {
    return {
      props: {
        tagDetails: null,
      },
      redirect: {
        destination: "/",
      },
    };
  }

  const tagDetails = await db.query.tags
    .findFirst({
      where: eq(tags.slug, params),
      with: {
        followers: {
          ...(session?.user.id && {
            where: eq(tagsToUsers.userId, session.user.id),
          }),
          columns: {
            userId: true,
          },
        },
      },
    })
    .then((res) => {
      if (!res) return;
      const { followers, ...rest } = res;
      return {
        ...rest,
        isFollowing: followers ? !!followers.length : false,
      };
    });

  return {
    props: {
      tagDetails: tagDetails
        ? (JSON.parse(JSON.stringify(tagDetails)) as DetailedTag)
        : null,
    },
  };
};
