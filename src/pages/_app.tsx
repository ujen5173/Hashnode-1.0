import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import NextTopLoader from "nextjs-toploader";

import "~/styles/globals.css";
import Context from "~/utils/context";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Context>
        <NextTopLoader color="#2563eb" />
        <Component {...pageProps} />
      </Context>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
