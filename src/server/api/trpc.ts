import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { stripe } from "~/server/stripe/client";

type CreateContextOptions = {
  session: Session | null;
  req: NextApiRequest;
  res: NextApiResponse;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  const { req, res } = opts;
  return {
    session: opts.session,
    prisma,
    stripe,
    req,
    res,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
    res, // Pass the Response object to the context
    req,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
