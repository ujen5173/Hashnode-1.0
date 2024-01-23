import { createTRPCRouter } from "~/server/api/trpc";
import {
  commentsRouter,
  feedbackRouter,
  handleRouter,
  likesRouter,
  notificationRouter,
  postsRouter,
  seriesRouter,
  stripeRouter,
  tagsRouter,
  usersRouter,
} from "./routers";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  stripe: stripeRouter,
  tags: tagsRouter,
  users: usersRouter,
  likes: likesRouter,
  comments: commentsRouter,
  notifications: notificationRouter,
  handles: handleRouter,
  series: seriesRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
