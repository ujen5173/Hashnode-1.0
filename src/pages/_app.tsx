import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import NextTopLoader from "nextjs-toploader";
import { api } from "~/utils/api";

import { ToastContainer } from "react-toastify";
import "~/styles/globals.css";
import Context from "~/utils/context";

import { useClickOutside } from "@mantine/hooks";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { SearchBody } from "~/component";
import useKeyPress from "~/hooks/use-keypress";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleKeyPress = (): void => {
    setSearchOpen(true);
  };

  useKeyPress(handleKeyPress);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [searchOpen]);

  const ref = useClickOutside<HTMLDivElement>(() => setSearchOpen(false));

  return (
    <SessionProvider session={session}>
      <Context options={{ searchOpen, setSearchOpen }}>
        <ToastContainer
          closeButton={false}
          pauseOnFocusLoss={false}
          toastClassName={() =>
            "relative bg-white dark:bg-zinc-900 text-neutral-800 dark:text-white flex p-1 min-h-15 rounded-md justify-between overflow-hidden cursor-pointer p-5 border-2 dark:border-zinc-800 :dark:fill:slate-50 mb-4"
          }
        />

        <NextTopLoader color="#2563eb" />

        <Component {...pageProps} />

        {searchOpen && <SearchBody ref={ref} setOpened={setSearchOpen} />}
      </Context>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
