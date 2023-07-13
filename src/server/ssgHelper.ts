import { createServerSideHelpers } from "@trpc/react-query/server";
import type { IncomingMessage, ServerResponse } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import SuperJSON from "superjson";
import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";

type RequestType = IncomingMessage & {
  cookies: Partial<{
    [key: string]: string;
  }>;
};

type ResponseType = ServerResponse;

type Args = {
  req: RequestType;
  res: ResponseType;
  /** If true, will skip getting the server-side session. */
  skipSession?: boolean;
};

// We need the request and response to get the user session.
export const generateSSGHelper = async ({ req, res }: Args) =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: req as NextApiRequest,
      res: res as NextApiResponse,
    }),
    transformer: SuperJSON,
  });
