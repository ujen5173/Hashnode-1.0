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
  user: {
    name: string;
    username: string;
    profile: string;
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
  bio: string;
}

export interface DetailedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: Date;
  profile: string;
  tagline: string;
  cover_image: string;
  bio: string;
  skills: string[];
  social: unknown;
  following: { username: string }[];
  followers: { username: string }[];
  followersCount: number;
  followingCount: number;
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
        followersCount: number;
      }[]
    | null;
  tags:
    | {
        id: string;
        name: string;
        slug: string;
        followersCount: number;
        articlesCount: number;
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
        slug: string;
        read_time: number;
        likesCount: number;
        commentsCount: number;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
}
