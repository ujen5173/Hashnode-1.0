import { type NotificationTypes } from "@prisma/client";
import React, {
  createContext,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type ArticleCard } from "~/types";

interface Props {
  children: React.ReactNode;
  options: Options;
}

interface Options {
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  type: "COMMENT" | "LIKE" | "NEW_ARTICLE" | "MENTION" | "FOLLOW" | "ALL";
}

export interface Notification {
  id: string;
  body?: string | null; // This is for comment notification
  type: NotificationTypes | null;
  slug?: string | null;
  title?: string | null;
  articleAuthor?: string | null;
  createdAt: Date;
  from: {
    username: string;
    name: string;
    profile: string;
  };
}

export interface ContextValue extends Options {
  handleTheme: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<SetStateAction<any>>
  ) => void;
  theme: "light" | "dark";
  bookmarks: { id: string }[];
  updateBookmark: (id: string) => void;
}

export const C = createContext<ContextValue | undefined>(undefined);

const Context = ({ children, options }: Props) => {
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


  return (
    <C.Provider
      value={{
        bookmarks,
        updateBookmark,
        theme,
        handleTheme,
        handleChange,

        ...options,
      }}
    >
      {children}
    </C.Provider>
  );
};

export default Context;
