import { type Session } from "next-auth";
import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  createContext,
} from "react";

export interface ContextValue {
  handleTheme: () => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Dispatch<SetStateAction<any>>
  ) => void;
  user: Session | null;
  setUser: Dispatch<SetStateAction<Session | null>>;
}

interface Props {
  children: React.ReactNode;
}

export const C = createContext<ContextValue | undefined>(undefined);

const Context = ({ children }: Props) => {
  const [user, setUser] = useState<Session | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
    <C.Provider value={{ handleTheme, handleChange, user, setUser }}>
      {children}
    </C.Provider>
  );
};

export default Context;
