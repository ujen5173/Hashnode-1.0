import { createTRPCRouter } from "~/server/api/trpc";
import { commentsRouter } from "./routers/comments";
import { likesRouter } from "./routers/likes";
import { postsRouter } from "./routers/posts";
import { TagsRouter } from "./routers/tags";
import { UsersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  tags: TagsRouter,
  users: UsersRouter,
  likes: likesRouter,
  comments: commentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
