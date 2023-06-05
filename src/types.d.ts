export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  user: {
    id: string;
    name: string;
    username: string;
    profile: string;
  };
  content: string;
  read_time: number;
  tags: {
    id?: string;
    name: string;
    slug: string;
  }[];
  likes: string[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
