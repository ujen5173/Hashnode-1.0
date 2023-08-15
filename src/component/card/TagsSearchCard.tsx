import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import { Check, Follow } from "~/svgs";
import { api } from "~/utils/api";

interface Props {
  tag: {
    id: string;
    name: string;
    slug: string;
    isFollowing: boolean;
  };
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const TagsSearchCard: FC<Props> = ({ tag, setOpened }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(tag.isFollowing);
  const { data: user } = useSession();

  const { mutate: followToggle } = api.tags.followTagToggle.useMutation();

  const followTag = () => {
    if (!user) {
      return toast.error("You need to be logged in to follow users");
    }

    setIsFollowing(!isFollowing);

    followToggle({
      name: tag.name,
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <Link
        href={`/tag/${tag.slug}`}
        className="tag flex flex-1 items-center justify-between"
      >
        <div
          onClick={() => void setOpened(false)}
          className="flex w-full flex-1 items-center gap-4"
        >
          <h1 className="text-xl font-semibold text-gray-700 dark:text-text-primary">
            #{tag.slug}
          </h1>
        </div>
      </Link>

      <button
        onClick={() => void followTag()}
        className="btn-outline flex w-full items-center justify-center gap-2 text-secondary md:w-max"
      >
        {isFollowing ? (
          <>
            <Check className="h-5 w-5 fill-secondary" />
            <span>Following</span>
          </>
        ) : (
          <>
            <Follow className="h-5 w-5 fill-secondary" />
            <span>Follow Tag</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TagsSearchCard;
