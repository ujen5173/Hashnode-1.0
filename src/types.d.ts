export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  cover_image: string | null;
  disabledComments: boolean;
  readCount: number;
  content: string;
  read_time: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  comments: Comment[];
  likes: { userId: string }[];
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
    stripeSubscriptionStatus: string | null;
    handle: {
      id: string;
      handle: string;
      name: string;
      about: string | null;
    } | null;
  };
  series: {
    title: string;
    slug: string;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export type ArticleForEdit = {
  title: string;
  subtitle: string | null;
  content: string;
  cover_image: string | null;
  cover_image_key: string | null;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoOgImage: string | null;
  seoOgImageKey: string | null;
  disabledComments: boolean;
  series: string | null;
  tags: string[];
};

// here `Omit` is used to remove the `subtitle` property from `Article` type and add `commonUsers` property
export interface ArticleCard
  extends Omit<Article, "subtitle" | "comments" | "likes" | "content"> {
  subContent: string | null;
  // commonUsers: {
  //   id: string;
  //   image: string | null;
  // }[];
}

export type ArticleCardRemoveCommonUser = Omit<ArticleCard, "commonUsers">;
export type ArticleCardRemoveCommonUserWithoutLikes = Omit<
  ArticleCard,
  "commonUsers"
>;

export interface ArticleCardWithComments
  extends ArticleCardRemoveCommonUserWithoutLikes {
  comments: {
    user: {
      id: string;
      image: string | null;
    };
  }[];
}

export interface Tag {
  id?: string | undefined;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  image: string;
  stripeSubscriptionStatus: string | null;
  handle?: {
    id: string;
    name: string;
    handle: string;
    about: string;
  } | null;
  bio: string;
}

export interface DetailedTag {
  id: string;
  name: string;
  slug: string;
  followersCount: string;
  articlesCount: string;
  isFollowing: boolean;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  body: string;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
    stripeSubscriptionStatus: string | null;
  };
  hasLiked: boolean;
  likesCount: number;
  type: "COMMENT" | "REPLY";
  parentId: string | null;
  repliesCount: number;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

interface SearchResults {
  users:
    | {
        id: string;
        name: string;
        username: string;
        image: string | null;
        stripeSubscriptionStatus: string | null;
        isFollowing: boolean;
        isAuthor: boolean;
      }[]
    | null;
  tags:
    | {
        id: string;
        name: string;
        slug: string;
        isFollowing: boolean;
      }[]
    | null;
  articles:
    | {
        id: string;
        title: string;
        cover_image: string | null;
        slug: string;
        likesCount: number;
        commentsCount: number;
        createdAt: Date;
        updatedAt: Date;
        user: {
          id: string;
          name: string;
          username: string;
          image: string | null;
          stripeSubscriptionStatus: string | null;
        };
      }[]
    | null;
}

export interface UserSimple {
  id: string;
  name: string;
  username: string;
  image: string | null;
  stripeSubscriptionStatus: string | null;
}

export interface DataType {
  id: string;
  title: string;
  slug: string;
  read_time: number;
  subContent: string | null;
  subtitle: string | null;
  cover_image: string | null;
  createdAt: Date;
  user: {
    image: string | null;
    username: string | null;
  };
}

export const NotificationTypes =
  "ALL" | "COMMENT" | "LIKE" | "NEW_ARTICLE" | "MENTION" | "FOLLOW";

export interface FilterData {
  status: boolean;
  data: {
    read_time: "OVER_5" | "5" | "UNDER_5" | null;
    tags: string[];
    shouldApply: boolean;
  };
}
export interface DetailedUser {
  followers: { id: string }[];
  isFollowing: boolean;
  handle: {
    handle: string;
    name: string;
    about: string;
    id: string;
  } | null;
  stripeSubscriptionStatus: string | null;
  followersCount: number;
  social: SocialHandles;
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: Date | null;
  image: string;
  tagline: string;
  cover_image: string;
  bio: string;
  skills: string[];
  location: string;
  available: string;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetails {
  name: string;
  username: string;
  email: string;
  location: string;
  image: string;
  tagline: string;
  stripeSubscriptionStatus?: string | null;
  available: string;
  cover_image: string;
  bio: string;
  skills: string;
  social: SocialHandles;
}

export interface SocialHandles {
  twitter: string;
  instagram: string;
  github: string;
  stackoverflow: string;
  facebook: string;
  website: string;
  linkedin: string;
  youtube: string;
}

interface ContentNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ContentNode[];
  marks?: Mark[];
  text?: string;
  checked?: boolean;
  src?: string;
  alt?: string;
  title?: string;
}

interface Mark {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
}

export interface DefaultEditorContent {
  type: string;
  content: ContentNode[];
}
