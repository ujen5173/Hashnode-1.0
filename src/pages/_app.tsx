import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import NextTopLoader from "nextjs-toploader";

import "~/styles/globals.css";
import Context from "~/utils/context";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Context>
        <ToastContainer
          closeButton={false}
          pauseOnFocusLoss={false}
          toastClassName={() =>
            "relative bg-white dark:bg-zinc-900 text-neutral-800 dark:text-white flex p-1 min-h-15 rounded-md justify-between overflow-hidden cursor-pointer p-5 border-2 dark:border-zinc-800 :dark:fill:slate-50 mb-4"
          }
        />
        <NextTopLoader color="#2563eb" />
        <Component {...pageProps} />
      </Context>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
