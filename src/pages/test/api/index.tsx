import { faker } from "@faker-js/faker";
import Head from "next/head";
import { api } from "~/utils/api";

const ApiTesting = () => {
  const { mutateAsync: createUser } = api.users.createUser.useMutation();
  const { mutateAsync: follow } = api.users.followUser.useMutation();
  const { data: user } = api.users.getUserByUsername.useQuery({
    username: "@ujen5173"
  });

  console.log({ user })

  const { mutateAsync: create } = api.handles.createPersonalHandle.useMutation();
  const { mutateAsync: navbardata } = api.handles.newNavbarData.useMutation();
  // const { data, isLoading } = api.handles.getNavbarData.useQuery({
  //   handle: "test-user"
  // });
  const { mutateAsync: update } = api.handles.updateNavbarData.useMutation();
  const { mutateAsync: deletedata } = api.handles.deleteNavbarData.useMutation();

  const createuser = async () => {
    const users = {
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      profile: faker.internet.avatar(),
      tagline: 'SOFTWARE DEVELOPER | DEVOPS DEVELOPER',
    }
    const res = await createUser(users);

    console.log({ res })
  }

  const followUser = async () => {
    const res = await follow({
      username: "@rijen98"
    });
    console.log({ res })
  }

  const createhandle = async () => {
    const res = await create({
      handle: {
        domain: 'programminghero',
        name: "ujencodes"
      }
    });
    console.log({ res })
  }

  const createcustomtab = async () => {
    const res = await navbardata({
      handle: "programminghero",
      tab: {
        label: "Linkedin",
        type: "link",
        value: "https://linkedin.com/ujen5173/Hashnode",
        priority: 2,
      }
    });
    console.log({ res })
  }

  const updatecustomtab = async () => {
    const res = await update({
      tabId: "eef9e56f-74c5-4342-adfe-21bf1eaaaafd",
      tab: {
        label: "Hackerrank",
        value: "https://hackerrank.com/ujen5173"
      }
    });
    console.log({ res })
  }

  const deletecustomtab = async () => {
    const res = await deletedata({
      tabId: "eef9e56f-74c5-4342-adfe-21bf1eaaaafd"
    });
    console.log({ res })
  }

  return (
    <>
      <Head>
        <title>Drizzle Api Testing!!</title>
      </Head>
      <div className="gap-2 flex items-center justify-center min-h-screen">
        <button onClick={() => void createuser()} className="btn-filled">Create User</button>
        <button onClick={() => void followUser()} className="btn-filled">Follow Rijen</button>
        <button onClick={() => void createhandle()} className="btn-filled">Create handle</button>
        <button onClick={() => void createcustomtab()} className="btn-filled">Create custom tabs</button>
        <button onClick={() => void updatecustomtab()} className="btn-filled">update custom tab</button>
        <button onClick={() => void deletecustomtab()} className="btn-filled">delete custom tab</button>
      </div>
    </>
  )
};

export default ApiTesting;
