import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const handleRouter = createTRPCRouter({
  createPersonalHandle: protectedProcedure
    .input(z.object({ handle: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const findExistingHandle = await ctx.prisma.handle.findUnique({
        where: {
          handle: input.handle,
        },
      });

      if (findExistingHandle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Handle already exists",
        });
      }

      const result = await ctx.prisma.handle.create({
        data: {
          handle: input.handle,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return result ? true : false;
    }),
});

export default handleRouter;
