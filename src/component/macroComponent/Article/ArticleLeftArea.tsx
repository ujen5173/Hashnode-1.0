import { ChevronLeft, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FC } from "react";

type UserType = {
  username: string;
  name: string;
  image: string | null;
  followers: { userId: string }[];
};
const ArticleLeftArea: FC<{ user: UserType; }> = ({
  user,
}) => {
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center gap-2">
      <Link href="/">
        <button
          aria-label="icon"
          role="button"
          className="btn-icon flex h-10 w-10"
        >
          <ChevronLeft className="h-5 w-5 stroke-gray-700 dark:stroke-text-secondary" />
        </button>
      </Link>

      <button
        aria-label="icon"
        role="button"
        onClick={() => setMenu((prev) => !prev)}
        className="btn-icon mr-2 flex h-10 w-10"
      >
        <Menu className="h-5 w-5 stroke-gray-700 dark:stroke-text-secondary" />
      </button>

      {/* <ArticleHamburgerMenu user={user} menu={menu} setMenu={setMenu} /> */}


      <Link
        aria-label="Visit image"
        className="hidden items-center gap-2 md:flex"
        href={`/u/@${user.username}`}
      >
        <Image
          src={user?.image ?? ""}
          alt={user?.name}
          width={70}
          height={70}
          draggable={false}
          className="h-8 w-8 rounded-full"
        />
        <h1 className="text-lg font-semibold text-gray-700 dark:text-text-secondary">
          {user?.name}&rsquo;s Blog
        </h1>
      </Link>
    </div>
  );
};

export default ArticleLeftArea;
