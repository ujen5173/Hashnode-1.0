export interface NotificationResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: "ALL" | "COMMENT" | "LIKE" | "NEW_ARTICLE";
  from: {
    name: string;
    username: string;
    image: string;
  };
  isRead: boolean;
  commentArticle?: {
    id: string;
    body: string;
    article: {
      title: string;
      slug: string;
    };
    user: {
      username: string;
      image: string;
      name: string;
    };
    createdAt: Date;
  };
  likeArticle?: {
    id: string;
    title: string;
    slug: string;
    user: {
      username: string;
      image: string;
      name: string;
    };
    createdAt: Date;
  };
  newArticle: {
    id: string;
    title: string;
    slug: string;
    user: {
      username: string;
      image: string;
      name: string;
    };
    createdAt: Date;
  };
}
