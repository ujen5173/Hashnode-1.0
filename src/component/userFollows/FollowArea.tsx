
import { useRouter } from "next/router";
import { FollowCard, TagLoading } from "~/component";
import { api } from "~/utils/api";

const FollowArea = () => {
  const router = useRouter();

  const { data: followersData, isLoading: isFollowersLoading } =
    api.users.getFollowersList.useQuery(
      {
        username: router.query.username as string,
      },
      {
        enabled: router.pathname?.includes("followers"),
        refetchOnWindowFocus: false,
      }
    );

  const { data: followingData, isLoading: isFollowingLoading } =
    api.users.getFollowingList.useQuery(
      {
        username: router.query.username as string,
      },
      {
        enabled: router.pathname?.includes("following"),
        refetchOnWindowFocus: false,
      }
    );

  const { mutate: follow } = api.users.followUserToggle.useMutation();

  const followUser = (username: string) => {
    follow({
      username,
    });
  }

  return (
    <div className="flex-1 py-6">
      {router.pathname.includes("followers") ? (
        <div className="flex flex-wrap gap-2">
          {isFollowersLoading ? (
            <>
              {Array(4)
                .fill("")
                .map((_, i) => (
                  <div
                    key={i}
                    className="tagloading w-full rounded-md border border-border-light dark:border-border md:w-[calc(100%/2-0.5rem)] lg:w-[calc(100%/3-0.5rem)]"
                  >
                    <TagLoading />
                  </div>
                ))}
            </>
          ) : (
            followersData?.map((user) => (
              <FollowCard user={user} key={user.id} followUser={followUser} />
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {isFollowingLoading ? (
            <>
              {Array(4)
                .fill("")
                .map((_, i) => (
                  <div
                    key={i}
                    className="tagloading w-full rounded-md border border-border-light dark:border-border md:w-[calc(100%/2-0.5rem)] lg:w-[calc(100%/3-0.5rem)]"
                  >
                    <TagLoading />
                  </div>
                ))}
            </>
          ) : (
            followingData?.map((user) => (
              <FollowCard user={user} key={user.id} followUser={followUser} />
            ))
          )}
        </div>
      )}
    </div>
  );
};




export default FollowArea;