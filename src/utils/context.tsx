import { useRouter } from "next/router";
import React, {
  createContext,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import useFilter, {
  DEFAULT_FILTER_DATA,
  type FilterTimeOption,
} from "~/hooks/useFilter";
import { type ArticleCard, type FilterData } from "~/types";

export enum NotificationTypesEnum {
  ALL = "ALL",
  COMMENT = "COMMENT",
  LIKE = "LIKE",
  ARTICLE = "ARTICLE",
  FOLLOW = "FOLLOW",
}

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
  type: NotificationTypesEnum;
}

export interface Notification {
  id: string;
  body?: string | null; // This is for comment notification
  type: string | null;
  slug?: string | null;
  title?: string | null;
  articleAuthor?: string | null;
  createdAt: Date;
  from: {
    username: string;
    name: string;
    image: string | null;
  };
}

export interface ContextValue extends Options {
  handleTheme: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<SetStateAction<unknown>>,
  ) => void;
  theme: "light" | "dark";
  bookmarks: { id: string }[];
  updateBookmark: (id: string) => void;
  filter: FilterData;
  setFilter: React.Dispatch<React.SetStateAction<FilterData>>;
  filterActions: {
    applyFilter: () => void;
    clearFilter: () => void;
  };
  timeFilter: FilterTimeOption;
  setTimeFilter: React.Dispatch<React.SetStateAction<FilterTimeOption>>;
}

export const C = createContext<ContextValue | undefined>(undefined);

const Context = ({ children, options }: Props) => {
  const { timeFilter, setTimeFilter, filter, setFilter, filterActions } =
    useFilter();

  const routerPath = useRouter().asPath;

  useEffect(() => {
    // setting filter data to default every time the router changes to avoid unexpected behavior
    setFilter(DEFAULT_FILTER_DATA);
  }, [routerPath]);

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
    setState: Dispatch<SetStateAction<Record<string, string>>>, // Specify the type of state properties
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
        filter,
        setFilter,
        filterActions,
        timeFilter,
        setTimeFilter,
        ...options,
      }}
    >
      {children}
    </C.Provider>
  );
};

export default Context;
