import { v4 as uuid } from "uuid";
import {
  Analytics,
  Bookmark,
  Bookmarkalt,
  Comment,
  Customize,
  Dailydev,
  Discord,
  Document,
  Exit,
  Explore,
  ExportFile,
  Feed,
  Github,
  Global,
  Hackathon,
  Heart,
  ImportFile,
  Instagram,
  Integrations,
  Linkedin,
  LogonoText,
  Manage,
  Mastodon,
  Navbar,
  Newsletter,
  Pages,
  Pen,
  Search,
  Seo,
  Series,
  Settings,
  Sponsors,
  Team,
  Tools,
  Twitter,
  User as UserSVG,
  Widgets,
  Youtube,
} from "~/svgs";

export const slugSetting = {
  lower: true,
  replacement: "-",
  strict: true,
  trim: true,
  locale: "en",
};

export const asideItems = [
  {
    name: "Explore",
    icon: (
      <Explore className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
    ),
    href: "/explore",
    type: "link",
  },
  {
    name: "Bookmarks",
    icon: (
      <Bookmark className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
    ),
    href: "/bookmarks",
    type: "link",
  },
  {
    name: "Hackathons",
    icon: (
      <Hackathon className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />
    ),
    href: "/hackathons",
    type: "link",
  },
  {
    name: "Team Blogs",
    icon: <Team className="h-4 w-4 fill-gray-700 dark:fill-text-secondary" />,
    href: "/team-blogs",
    type: "link",
  },
];

enum Type {
  all = "all",
  new_articles = "new_article",
  comments = "comment",
  likes = "like",
}

export const notificationNavigation = (notificationType: Type) => {
  return [
    {
      id: 123,
      name: "all",
      label: "All Notifications",
      icon: null,
    },
    {
      id: 345,
      name: "comment",
      label: "Comments",
      icon: (name: string) => (
        <Comment
          className={`h-4 w-4 fill-none ${notificationType === name
            ? "stroke-secondary"
            : "stroke-gray-700 dark:stroke-text-secondary"
            }`}
        />
      ),
    },
    {
      id: 567,
      name: "like",
      label: "Likes",
      icon: (name: string) => (
        <Heart
          className={`h-4 w-4 fill-none ${notificationType === name
            ? "stroke-secondary"
            : "stroke-gray-700 dark:stroke-text-secondary"
            }`}
        />
      ),
    },
    {
      id: 789,
      name: "new_article",
      label: "Articles",
      icon: (name: string) => (
        <Document
          className={`h-4 w-4 fill-none ${notificationType === name
            ? "stroke-secondary"
            : "stroke-gray-700 dark:stroke-text-secondary"
            }`}
        />
      ),
    },
  ];
};

export const others = [
  [
    {
      id: uuid(),
      name: "Feature Requests",
      link: "https://roadmap.hashnode.vercel.app/feature-requests",
    },
    {
      id: uuid(),
      name: "Changelog",
      link: "https://roadmap.hashnode.vercel.app/changelog",
    },
    {
      id: uuid(),
      name: "Hashnode APIs",
      link: "api.hahsnode.vercel.app",
    },
  ],
  [
    {
      id: uuid(),
      name: "About",
      link: "https://hashnode.vercel.app/about",
    },
    {
      id: uuid(),
      name: "Service Status",
      link: "https://hashnode.vercel.app/status",
    },
    {
      id: uuid(),
      name: "Official Blog",
      link: "https://hashnode.vercel.app/blog",
    },
    {
      id: uuid(),
      name: "Press Kit",
      link: "https://hashnode.vercel.app/press",
    },
    {
      id: uuid(),
      name: "Support",

      link: "https://hashnode.vercel.app/support",
    },
    {
      id: uuid(),
      name: "Careers",

      link: "https://hashnode.vercel.app/careers",
    },
    {
      id: uuid(),
      name: "OSS ACK",
      link: "https://hashnode.vercel.app/oss-ack",
    },
  ],
  [
    {
      id: uuid(),
      name: "Privacy Policy",
      link: "https://hashnode.vercel.app/privacy",
    },
    {
      id: uuid(),
      name: "Terms of Service",
      link: "https://hashnode.vercel.app/terms",
    },
  ],
];

export const dashboardNavigations = [
  {
    id: uuid(),
    name: "General",
    icon: (state: boolean) => (
      <Settings
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/general",
  },
  {
    id: uuid(),
    name: "Appearance",
    icon: (state: boolean) => (
      <Customize
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/appearance",
  },
  {
    id: uuid(),
    name: "Navbar",
    icon: (state: boolean) => (
      <Navbar
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/navbar",
  },
  {
    id: uuid(),
    name: "Articles",
    icon: (state: boolean) => (
      <Feed
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/articles",
  },
  {
    id: uuid(),
    name: "Series",
    icon: (state: boolean) => (
      <Series
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/series",
  },
  {
    id: uuid(),
    name: "Pages",
    icon: (state: boolean) => (
      <Pages
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/pages",
  },
  {
    id: uuid(),
    name: "Sponsors",
    icon: (state: boolean) => (
      <Sponsors
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/sponsors",
  },
  {
    id: uuid(),
    name: "Analytics",
    icon: (state: boolean) => (
      <Analytics
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/analytics",
  },
  {
    id: uuid(),
    name: "Widgets",
    icon: (state: boolean) => (
      <Widgets
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/widgets",
  },
  {
    id: uuid(),
    name: "Newsletter",
    icon: (state: boolean) => (
      <Newsletter
        className={`h-5 w-5 fill-gray-700 dark:fill-text-secondary ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/newsletter",
  },
  {
    id: uuid(),
    name: "Integrations",
    icon: (state: boolean) => (
      <Integrations
        className={`h-5 w-5 fill-gray-700 dark:fill-text-secondary ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/integrations",
  },
  {
    id: uuid(),
    name: "SEO",
    icon: (state: boolean) => (
      <Seo
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/seo",
  },
  {
    id: uuid(),
    name: "Domain",
    icon: (state: boolean) => (
      <Global
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/domain",
  },
  {
    id: uuid(),
    name: "GitHub",
    icon: (state: boolean) => (
      <Github
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/github",
  },
  {
    id: uuid(),
    name: "Import",
    icon: (state: boolean) => (
      <ImportFile
        className={`h-5 w-5 fill-gray-700 dark:fill-text-secondary ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/import",
  },
  {
    id: uuid(),
    name: "Export",
    icon: (state: boolean) => (
      <ExportFile
        className={`h-5 w-5 fill-gray-700 dark:fill-text-secondary ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/export",
  },
  {
    id: uuid(),
    name: "Advanced",
    icon: (state: boolean) => (
      <Tools
        className={`h-5 w-5 ${state ? "fill-white" : "fill-gray-700 dark:fill-text-secondary"
          }`}
      />
    ),
    link: "/dashboard/advanced",
  },
];

export const generalSettingsSocials = [
  {
    id: uuid(),
    label: "Twitter Profile",
    placeholder: "https://twitter.com/username",
    name: "twitter",
    icon: <Twitter className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
  {
    id: uuid(),
    label: "Mastodon Profile",
    placeholder: "https://mastodon.social/@username",
    name: "mastodon",
    icon: <Mastodon className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
  {
    id: uuid(),
    label: "Instagram Profile",
    placeholder: "https://instagram.com/username",
    name: "instagram",
    icon: (
      <Instagram className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Github Profile",
    placeholder: "https://github.com/username",
    name: "github",
    icon: <Github className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
  {
    id: uuid(),
    label: "Your Website",
    placeholder: "https://something.com",
    name: "website",
    icon: <Global className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
  {
    id: uuid(),
    label: "Hashnode Profile",
    placeholder: "https://hashnode.com/@username",
    name: "hashnode",
    icon: (
      <LogonoText className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
    ),
  },
  {
    id: uuid(),
    label: "Youtube Channel",
    placeholder: "https://youtube.com/@username",
    name: "youtube",
    icon: <Youtube className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
  {
    id: uuid(),
    label: "Daily.dev Profile",
    placeholder: "https://app.daily.dev/username",
    name: "dailydev",
    icon: <Dailydev className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
  },
];

export const HashnodeSocials = [
  {
    name: "Twitter",
    color: "#1da1f2",
    icon: <Twitter className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
    link: "https://twitter.com/ujen_basi/",
  },
  {
    name: "Linkedin",
    color: "#0077b5",
    icon: <Linkedin className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
    link: "https://linkedin.com/ujen_basi/",
  },
  {
    name: "Discord",
    color: "#7289da",
    icon: <Discord className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />,
    link: "https://discord.com/ujen_basi/",
  },
  {
    name: "Instagram",
    color: "#e1306c",
    icon: (
      <Instagram className="h-5 w-5 fill-gray-500 dark:fill-text-primary" />
    ),
    link: "https://instagram.com/ujen_basi/",
  },
];

export const selectArticleCard = {
  id: true,
  title: true,
  slug: true,
  cover_image: true,
  disabledComments: true,
  readCount: true,
  user: {
    select: {
      id: true,
      name: true,
      username: true,
      profile: true,
      bio: true,
      stripeSubscriptionStatus: true,
      handle: {
        select: {
          id: true,
          handle: true,
          name: true,
          about: true,
        },
      },
    },
  },
  series: {
    select: {
      slug: true,
      title: true,
    },
  },
  comments: {
    select: {
      user: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
  },
  content: true,
  read_time: true,
  tags: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  likes: { select: { id: true } },
  likesCount: true,
  commentsCount: true,
  createdAt: true,
} as const;

export function displayUniqueObjects(
  objects: Array<{ id: string; profile: string }>
) {
  // Create a set to store the unique IDs.
  const uniqueIds = new Set();
  // Create an array to store the unique objects.
  const uniqueObjects = [];

  // Iterate over the objects and add them to the set if they are not already present.
  for (const object of objects) {
    const id = object.id;
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      uniqueObjects.push(object);
    }
  }

  // Return the list of unique objects.
  return uniqueObjects;
}


export const profileDropdownList = [
  {
    type: "divider",
  },
  {
    name: "My Bookmarks",
    icon: <Bookmarkalt className="h-4 w-4 fill-gray-900 dark:fill-text-secondary" />,
    link: (userId: string) => "/bookmarks",
    hiddenItem: false,
    danger: false,
  }, {
    name: "Account Settings",
    icon: <UserSVG className="h-4 w-4 fill-gray-900 dark:fill-text-secondary" />,
    link: (userId: string) => "/settings",
    hiddenItem: false,
    danger: false,
  }, {
    name: "Manage your blogs",
    icon: <Manage className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-secondary" />,
    link: (userId: string) => `/${userId}/dashboard`,
    hiddenItem: false,
    danger: false,
  }, {
    name: "Search",
    icon: <Search className="h-4 w-4 stroke-gray-900 dark:stroke-text-secondary" />,
    link: null,
    hiddenItem: true,
    danger: false,
    onClick: (
      setOpened: React.Dispatch<React.SetStateAction<boolean>>,
      setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      setOpened(false);
      setSearchOpen(true);
    }
  }, {
    type: "divider",
  }, {
    name: "Log out",
    icon: <Exit className="h-4 w-4 fill-red" />,
    hiddenItem: false,
    link: null,
    danger: true,
  }
]

export const articleProfileDropdownList = [
  {
    type: "divider",
  },
  {
    name: "Dashboard",
    icon: <Settings className="h-4 w-4 fill-gray-900 stroke-none dark:fill-text-secondary" />,
    link: (userId: string) => `/${userId}/dashboard`,
    hiddenItem: false,
    danger: false,
  }, {
    name: "New Article",
    icon: <Pen className="h-4 w-4 fill-none stroke-gray-900 dark:stroke-text-secondary" />,
    link: (userId: string) => `/article/new`,
    hiddenItem: false,
    danger: false,
  }, {
    name: "My Bookmarks",
    icon: <Bookmarkalt className="h-4 w-4 fill-gray-900 dark:fill-text-secondary" />,
    link: (userId: string) => "/bookmarks",
    hiddenItem: false,
    danger: false,
  }, {
    type: "divider",
  }, {
    name: "Back to Hashnode",
    icon: <LogonoText className="h-4 w-4 fill-secondary" />,
    link: (userId: string) => "/",
    hiddenItem: false,
    danger: false,
  }, {
    name: "Profile settings",
    icon: <UserSVG className="h-4 w-4 fill-gray-900 dark:fill-text-secondary" />,
    link: (userId: string) => "/settings",
    hiddenItem: false,
    danger: false,
  }, {
    type: "divider",
  }, {
    name: "Log out",
    icon: <Exit className="h-4 w-4 fill-red" />,
    hiddenItem: false,
    link: null,
    danger: true,
  }
]