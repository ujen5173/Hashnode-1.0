import type { CommentType } from "@prisma/client";

export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  cover_image: string | null;
  disabledComments: boolean;
  readCount: number;
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    bio: string;
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
  content: string;
  read_time: number;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  likes: { id: string }[];
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

// here `Omit` is used to remove the `subtitle` property from `Article` type and add `commonUsers` property
export interface ArticleCard extends Omit<Article, "subtitle" | "comments"> {
  commonUsers: {
    id: string;
    profile: string;
  }[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ArticleCardRemoveCommonUser
  extends Omit<ArticleCard, "commonUsers"> {}

export interface ArticleCardWithComments extends ArticleCardRemoveCommonUser {
  comments: {
    user: {
      id: string;
      profile: string;
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
  profile: string;
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
  followers: { id: string }[];
  articles: { id: string }[];
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
    profile: string;
    stripeSubscriptionStatus: string | null;
  };
  likes: { id: string }[];
  likesCount: number;
  type: CommentType;
  parentId?: string | null;
  articleId?: string | null;
  repliesCount?: number;

  createdAt: Date;
  updatedAt: Date;
}

interface SearchResults {
  users:
    | {
        id: string;
        name: string;
        username: string;
        profile: string;
        stripeSubscriptionStatus: string | null;
        isFollowing: boolean;
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
        user: {
          id: string;
          name: string;
          username: string;
          profile: string;
          stripeSubscriptionStatus: string | null;
        };
        cover_image: string;
        readCount: number;
        series?: {
          title: string;
        };
        slug: string;
        read_time: number;
        likesCount: number;
        commentsCount: number;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
}

export interface UserSimple {
  id: string;
  name: string;
  username: string;
  profile: string;
  stripeSubscriptionStatus: string | null;
}

export interface DataType {
  id: string;
  title: string;
  slug: string;
  read_time: number;
  content: string;
  subtitle: string | null;
  cover_image: string | null;
  createdAt: Date;
  user: {
    profile: string;
    username: string;
  };
}

export interface FilterData {
  status: boolean;
  data: {
    read_time: "Over 5 min" | "5 min" | "Under 5 min" | null | undefined;
    tags: {
      id: string;
      name: string;
    }[];
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
  profile: string;
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
  profile: string;
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
  attrs?: Record<string, any>;
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
  attrs?: Record<string, any>;
  text?: string;
}

export interface DefaultEditorContent {
  type: string;
  content: ContentNode[];
}
