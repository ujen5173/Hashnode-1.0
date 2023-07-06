export interface NotificationResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: "ALL" | "COMMENT" | "LIKE" | "NEW_ARTICLE";
  from: {
    name: string;
    username: string;
    profile: string;
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
      profile: string;
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
      profile: string;
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
      profile: string;
      name: string;
    };
    createdAt: Date;
  };
}
