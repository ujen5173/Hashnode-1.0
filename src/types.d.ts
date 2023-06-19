import type { Article, CommentType } from "@prisma/client";

export interface ArticleCard {
  id: string;
  title: string;
  subtitle?: string | undefined;
  slug: string;
  cover_image?: string | null;
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
  };
  content: string;
  read_time: number | string;
  tags: {
    id?: string;
    name: string;
    slug: string;
  }[];
  likes: { id: string }[];
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
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
  replies: Comment[];
  repliesCount: number;
  parentId?: string | null;
  articleId?: string | null;

  createdAt: Date;
  updatedAt: Date;
}
