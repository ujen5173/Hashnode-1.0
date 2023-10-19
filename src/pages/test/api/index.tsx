import { faker } from "@faker-js/faker";
import Head from "next/head";
import { api } from "~/utils/api";

const ApiTesting = () => {
  const { data, isLoading } = api.users.getUserByUsername.useQuery({
    username: "@Anjali_Little"
  }, {
    refetchOnWindowFocus: false,
    retry: false,
  });
  console.log({ data, isLoading })
  const { mutateAsync } = api.users.createUser.useMutation();
  const { mutateAsync: follow } = api.users.followUser.useMutation();

  const create = async () => {
    const users = {
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      profile: faker.internet.avatar(),
      tagline: 'SOFTWARE DEVELOPER | DEVOPS DEVELOPER',
    }
    const res = await mutateAsync(users);

    console.log({ res })
  }

  const followUser = async () => {
    const res = await follow({
      username: "@Anjali_Little"
    });
    console.log({ res })
  }

  return (
    <>
      <Head>
        <title>Drizzle Api Testing!!</title>
      </Head>
      <div className="gap-2 flex items-center justify-center min-h-screen">
        <button onClick={() => void create()} className="btn-filled">Create User</button>
        <button onClick={() => void followUser()} className="btn-filled">Follow User</button>
      </div>
    </>
  )
};

export default ApiTesting;
