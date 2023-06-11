import { type Session } from "next-auth";
import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  createContext,
} from "react";
import { Times } from "~/svgs";

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
}

interface Props {
  children: React.ReactNode;
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

  return (
    <C.Provider
      value={{
        bookmarks,
        updateBookmark,
        handleTheme,
        handleChange,
        user,
        setUser,
      }}
    >
      {children}
    </C.Provider>
  );
};

export default Context;
