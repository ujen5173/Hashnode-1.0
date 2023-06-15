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
  comments: string[];
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
  bio?: string | null;
}

export interface DetailedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: Date | null;
  profile?: string | null;
  tagline?: string | null;
  cover_image: string;
  bio?: string | null;
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
