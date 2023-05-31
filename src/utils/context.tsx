import React, { createContext, useEffect } from "react";

export const C = createContext({
  handleTheme: () => {
    const html = document.querySelector("body");
    if (html?.classList.contains("dark")) {
      html?.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html?.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  },
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { value, name } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    setState((prev: any) => ({ ...prev, [name]: value }));
  },
} as {
  handleTheme: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => void;
});

const Context = ({ children }: { children: React.ReactNode }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { value, name } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    setState((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleTheme = () => {
    const body = document.querySelector("body");
    if (body?.classList.contains("dark")) {
      body?.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      body?.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(() => {
    // theme init
    const body = document.querySelector("body");
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      body?.classList.add("dark");
      body?.classList.remove("light");
    } else {
      body?.classList.add("light");
      body?.classList.remove("dark");
    }
  }, []);

  return (
    <C.Provider value={{ handleTheme, handleChange }}>{children}</C.Provider>
  );
};

export default Context;
