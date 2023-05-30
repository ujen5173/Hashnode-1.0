import Link from "next/link";
import Hamburger from "~/svgs/Hamburger";
import Angleleft from "~/svgs/Angleleft";
import Image from "next/image";

const ArticleLeftArea = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => history.back()}
        aria-label="icon"
        role="button"
        className="btn-icon flex h-10 w-10"
      >
        <Angleleft className="h-5 w-5 fill-black dark:fill-white" />
      </button>
      <button
        aria-label="icon"
        role="button"
        className="btn-icon mr-2 flex h-10 w-10"
      >
        <Hamburger className="h-5 w-5 fill-black dark:fill-white" />
      </button>
      <Link
        aria-label="Visit Profile"
        className="flex items-center gap-2"
        href="/@test"
      >
        <Image
          src={
            "https://cdn.hashnode.com/res/hashnode/image/upload/v1664920854781/pxV1rFkj-.png?w=400&h=400&fit=crop&crop=faces&auto=compress,format&format=webp"
          }
          alt=""
          width={70}
          height={70}
          className="h-8 w-8 rounded-full"
        />
        <h1 className="hidden text-lg font-semibold text-gray-700 dark:text-text-secondary md:block md:text-xl">
          Danijel Maksimovic&rsquo;s Blog
        </h1>
      </Link>
    </div>
  );
};

export default ArticleLeftArea;
