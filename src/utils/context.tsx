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
} as {
  handleTheme: () => void;
});

const Context = ({ children }: { children: React.ReactNode }) => {
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

  return <C.Provider value={{ handleTheme }}>{children}</C.Provider>;
};

export default Context;
