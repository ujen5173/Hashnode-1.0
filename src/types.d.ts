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
  likes: string[];
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
