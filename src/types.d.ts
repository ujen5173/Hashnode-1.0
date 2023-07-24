import type { CommentType } from "@prisma/client";

export interface Article {
  id: string;
  title: string;
  subtitle?: string | undefined;
  slug: string;
  cover_image?: string | null;
  disabledComments: boolean;
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
    bio: string;
    handle?: {
      handle: string;
      name: string;
      about: string;
    } | null;
  };
  series?: {
    title: string;
    slug: string;
  };
  content: string;
  read_time: number;
  tags: {
    id?: string;
    name: string;
    slug: string;
  }[];
  likes: { id: string }[];
  comments: Comment[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  cover_image?: string | null;
  disabledComments: boolean;
  commonUsers: {
    profile: string;
    id: string;
  }[];
  series?: {
    title: string;
    slug: string;
  } | null;
  user: {
    name: string;
    username: string;
    profile: string;
    handle?: {
      handle: string;
    } | null;
    id?: string;
  };
  content: string;
  read_time: number;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  likes: { id: string }[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
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
          name: string;
          username: string;
          profile: string;
          id: string;
        };
        cover_image: string;
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
