import { createTRPCRouter } from "~/server/api/trpc";
import {
  commentsRouter,
  likesRouter,
  notificationRouter,
  postsRouter,
  tagsRouter,
  usersRouter,
} from "./routers";
import handleRouter from "./routers/handle";
import SeriesRouter from "./routers/series";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  tags: tagsRouter,
  users: usersRouter,
  likes: likesRouter,
  comments: commentsRouter,
  notifications: notificationRouter,
  handles: handleRouter,
  series: SeriesRouter,
});

export type AppRouter = typeof appRouter;
