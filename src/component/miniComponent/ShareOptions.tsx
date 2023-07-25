import React from "react";
import { toast } from "react-toastify";
import {
  Facebook,
  HackerNews,
  Linkedin,
  Permalink,
  Reddit,
  Twitter,
  WhatsApp,
} from "~/svgs";

const ShareOptions = React.forwardRef<
  HTMLDivElement,
  {
    acticleDetails: {
      title: string;
      by: string;
    };
    setShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
>(({ acticleDetails, setShareOpen }, ref) => {
  const OPTIONS = [
    {
      name: "Permalink",
      icon: (
        <Permalink className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        void navigator.clipboard.writeText(window.location.href);
        setShareOpen(false);
        toast.success("Link copied to clipboard");
      },
    },
    {
      name: "Twitter",
      icon: (
        <Twitter className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${window.location.href}&text=${acticleDetails.title}&via=${acticleDetails.by} on @HashnodeClone`,
          "_blank"
        );
        setShareOpen(false);
      },
    },
    {
      name: "Reddit",
      icon: (
        <Reddit className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        window.open(
          `https://www.reddit.com/submit?url=${window.location.href}&title=${acticleDetails.title}`,
          "_blank"
        );
        setShareOpen(false);
      },
    },
    {
      name: "LinkedIn",
      icon: (
        <Linkedin className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${acticleDetails.title}&source=Hashnode-clone`,
          "_blank"
        );
        setShareOpen(false);
      },
    },
    {
      name: "Hacker News",
      icon: (
        <HackerNews className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        window.open(
          `https://news.ycombinator.com/submitlink?u=${window.location.href}&t=${acticleDetails.title}`,
          "_blank"
        );
        setShareOpen(false);
      },
    },
    {
      name: "Facebook",
      icon: (
        <Facebook className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
          "_blank"
        );
        setShareOpen(false);
      },
    },
    {
      name: "WhatsApp",
      icon: (
        <WhatsApp className="h-4 w-4 fill-border dark:fill-text-primary md:h-5 md:w-5" />
      ),
      action: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${window.location.href}`,
          "_blank"
        );
        setShareOpen(false);
      },
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute -right-full bottom-full mb-2 min-w-[190px] rounded-md border border-border-light bg-white shadow-md dark:border-border dark:bg-primary md:-left-2"
    >
      <ul className="py-2">
        {OPTIONS.map((option, index) => (
          <li
            onClick={option.action}
            className="flex w-full cursor-pointer items-center justify-start gap-3 px-4 py-2 pr-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-text-secondary dark:hover:bg-border"
            key={index}
          >
            {option.icon}
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
});
ShareOptions.displayName = "ShareOptions";

export default ShareOptions;
