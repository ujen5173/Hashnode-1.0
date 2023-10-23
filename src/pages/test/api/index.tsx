import { faker } from "@faker-js/faker";
import Head from "next/head";
import { api } from "~/utils/api";

const ApiTesting = () => {
  const { mutateAsync } = api.users.createUser.useMutation();
  const { mutateAsync: handleMutate } = api.handles.createPersonalHandle.useMutation();
  const { mutateAsync: customTabMutate } = api.handles.newNavbarData.useMutation();
  const { mutateAsync: articleMutate } = api.posts.new.useMutation();
  const { mutateAsync: seriesMutate } = api.series.new.useMutation();
  const { mutateAsync: commentMutate } = api.comments.newComment.useMutation();

  const { mutateAsync: updateArticleMutate } = api.posts.new.useMutation();

  const { data: userdata } = api.users.getUserByUsername.useQuery({ username: "@Brant.Mitchell" }, {
    refetchOnWindowFocus: false,
  });
  console.log({ userdata })
  const { data: articledata } = api.posts.getAll.useQuery({
    limit: 10,
    skip: 0
  }, {
    refetchOnWindowFocus: false,

  });
  console.log({ articledata })

  const launch = async () => {
    // create user
    const usersData = [];
    for (let i = 0; i < 2; i++) {
      const userData = {
        name: faker.internet.displayName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        profile: faker.internet.url(),
        tagline: faker.lorem.sentence({
          min: 1,
          max: 2
        }),
        cover_image: faker.internet.url(),
        bio: faker.lorem.sentence({
          min: 1,
          max: 2,
        }),
        skills: [faker.lorem.word({
          length: 20
        }), faker.lorem.word({
          length: 20
        }), faker.lorem.word({
          length: 20
        })],
        location: faker.location.city(),
        available: faker.lorem.sentence({
          min: 1,
          max: 2
        }),
        social: {
          github: faker.internet.url(),
          twitter: faker.internet.url(),
          website: faker.internet.url(),
          youtube: faker.internet.url(),
          facebook: faker.internet.url(),
          linkedin: faker.internet.url(),
        }
      }

      const [user] = await mutateAsync(userData);
      usersData.push(user)
    }
    const [user, from] = usersData;
    console.log([user, from])

    console.log({ user });

    // create handle
    const handleData = {
      userId: user?.id as string,
      handle: {
        domain: faker.internet.domainName(),
        name: faker.internet.displayName(),
      }
    }

    const [handle] = await handleMutate(handleData);

    console.log({ handle })

    // customTabs
    const customTabsData = {
      handle: handle?.handle as string,
      tab: {
        label: faker.lorem.word({ length: 5 }),
        type: "link",
        value: faker.internet.url(),
        priority: faker.number.int({ min: 1, max: 10 }),
      },
    }

    const customTab = await customTabMutate(customTabsData);

    console.log({ customTab });

    // articles
    const articleData = {
      title: faker.lorem.sentence({ min: 5, max: 10 }),
      subtitle: faker.lorem.sentence({ min: 5, max: 10 }),
      content: faker.lorem.paragraph({ min: 50, max: 1000 }),
      cover_image: faker.internet.url(),
      cover_image_Key: faker.lorem.word({ length: 10 }),
      tags: [faker.lorem.word({ length: 10 }), 'voluptates', 'volutabrum'],
      slug: faker.lorem.slug(),
      seoTitle: faker.lorem.sentence({ min: 5, max: 10 }),
      seoDescription: faker.lorem.sentence({ min: 5, max: 10 }),
      seoOgImage: faker.internet.url(),
      disabledComments: faker.datatype.boolean(),

      edit: false,
      userId: user?.id as string,
    }

    const article = await articleMutate(articleData)
    console.log({ article })

    // series
    const seriesData = {
      title: faker.lorem.sentence({ min: 5, max: 10 }),
      description: faker.lorem.sentence({ min: 5, max: 10 }),
      cover_image: faker.internet.url(),
      slug: faker.lorem.slug(),
      edit: false,
      userId: user?.id as string,
    }

    const [series] = await seriesMutate(seriesData)
    console.log({ series });

    // // update article and add the series id
    const updatedArticleData = {
      ...article,
      slug: article?.slug as string,
      title: article?.title as string,
      subtitle: article?.subtitle as string,
      content: article?.content as string,
      seoTitle: article?.seoTitle as string,
      cover_image: article?.cover_image as string,
      cover_image_key: article?.cover_image_key as string,
      seoDescription: article?.seoDescription as string,
      seoOgImage: article?.seoOgImage as string,
      tags: [...(article?.tags as { tag: { name: string } }[]).map(e => e.tag.name), "codingisbest"] as string[],

      seriesId: series?.id as string,
      userId: user?.id as string,
      edit: true,
    }
    const updatedArticle = await updateArticleMutate(updatedArticleData);
    console.log({ updatedArticle })

    const commentData = {
      articleId: updatedArticle?.id as string,
      userId: user?.id as string,
      content: faker.lorem.sentence({ min: 1, max: 3 }),
      toId: from?.id as string,
    }

    const comment = await commentMutate({
      ...commentData,
      type: "COMMENT",
    });
    console.log({ comment });

    const replyData = {
      articleId: updatedArticle?.id as string,
      userId: from?.id as string,
      content: faker.lorem.sentence({ min: 1, max: 3 }),
      toId: user?.id as string,
      commentId: comment,
    }

    const reply = await commentMutate({
      ...replyData,
      type: "REPLY",
    });
    console.log({ reply });
  }

  const { mutateAsync: deleteAll } = api.posts.deleteAll.useMutation();

  const delAll = async () => {
    const res = await deleteAll();
    console.log({ res });
  }

  return (
    <>
      <Head>
        <title>Drizzle Api Testing!!</title>
      </Head>
      <div className="gap-2 flex items-center justify-center min-h-screen">
        <button onClick={() => void launch()} className="btn-tertiary">LAUNCH</button>
        <button onClick={() => void delAll()} className="btn-outline">DELETE</button>
      </div>
    </>
  )
};

export default ApiTesting;
