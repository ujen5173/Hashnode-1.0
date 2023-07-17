import { createTRPCRouter } from "~/server/api/trpc";
import {
  commentsRouter,
  likesRouter,
  notificationRouter,
  postsRouter,
  tagsRouter,
  usersRouter
} from "./routers";
import handleRouter from "./routers/handle";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  tags: tagsRouter,
  users: usersRouter,
  likes: likesRouter,
  comments: commentsRouter,
  notifications: notificationRouter,
  handles: handleRouter,
});

export type AppRouter = typeof appRouter;
