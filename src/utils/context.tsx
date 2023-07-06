import { type Session } from "next-auth";
import React, {
  createContext,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "react-toastify";
import { type ArticleCard } from "~/types";
import { api } from "./api";

interface Props {
  children: React.ReactNode;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  articlesCount: number;
}

export interface TrendingTagsTypes {
  data: Tag[] | undefined;
  isLoading: boolean;
}
export interface TrendingArticleTypes {
  data: ArticleCard[] | undefined;
  isLoading: boolean;
}
export interface NotificationDataTypes {
  data: Notification[] | undefined;
  isLoading: boolean;
  type: "ALL" | "COMMENT" | "LIKE" | "NEW_ARTICLE";
}

export interface Notification {
  id: string;
  body?: string | null; // This is for comment notification
  type: "ALL" | "COMMENT" | "LIKE" | "NEW_ARTICLE";
  slug: string;
  title: string;
  createdAt: Date;
  from: {
    username: string;
    name: string;
    profile: string;
  };
}

export interface ContextValue {
  handleTheme: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<SetStateAction<any>>
  ) => void;
  user: Session | null;
  setUser: Dispatch<SetStateAction<Session | null>>;
  bookmarks: { id: string }[];
  updateBookmark: (id: string) => void;
  following: {
    status: boolean;
    followersCount: string;
  };
  setFollowing: Dispatch<
    SetStateAction<{
      status: boolean;
      followersCount: string;
    }>
  >;
  followUser: () => void;
}

export const C = createContext<ContextValue | undefined>(undefined);

const Context = ({ children }: Props) => {
  const [user, setUser] = useState<Session | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [bookmarks, setBookmarks] = useState<{ id: string }[]>([]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    const newBookmarks = savedBookmarks
      ? (JSON.parse(savedBookmarks) as { id: string }[])
      : [];
    setBookmarks(newBookmarks);
  }, []);

  const updateBookmark = (id: string) => {
    const newBookmark = bookmarks.find((bookmark) => bookmark.id === id);
    if (newBookmark) {
      const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } else {
      const newBookmarks = [...bookmarks, { id }];
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<SetStateAction<{ [key: string]: string }>> // Specify the type of state properties
  ) => {
    const { value, name } = e.target;
    setState((prev) => ({ ...prev, [name]: value })); // Remove the unnecessary type annotation
  };

  const handleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const body = document.querySelector("body");

    // theme init
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const newTheme = savedTheme || "light";
    setTheme(newTheme);
    body?.classList.add(newTheme);
    body?.classList.remove(newTheme === "light" ? "dark" : "light");
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");

    body?.classList.add(theme);
    body?.classList.remove(theme === "light" ? "dark" : "light");
  }, [theme]);

  const [following, setFollowing] = useState<{
    status: boolean;
    followersCount: string;
  }>({
    status: false,
    followersCount: "0",
  });

  const { mutate: followToggle } = api.users.followUserToggle.useMutation();

  const followUser = () => {
    const username = new URL(window.location.href).pathname
      .split("/")[2]
      ?.replace("@", "") as string;

    if (!user) {
      return toast.error("You need to be logged in to follow users");
    }

    if (user.user.username === username) {
      return toast.error("You can't follow yourself");
    }

    setFollowing({
      status: !following.status,
      followersCount: following.status
        ? JSON.stringify(parseInt(following.followersCount) - 1)
        : JSON.stringify(parseInt(following.followersCount) + 1),
    });

    followToggle({
      username,
    });
  };

  return (
    <C.Provider
      value={{
        bookmarks,
        updateBookmark,
        handleTheme,
        handleChange,
        user,
        setUser,

        following,
        setFollowing,
        followUser,
      }}
    >
      {children}
    </C.Provider>
  );
};

export default Context;
