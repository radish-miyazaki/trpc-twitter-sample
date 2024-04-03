import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tweetRouter } from "./routers/tweet";
import { userRouter } from "./routers/user";
import { tweetLikeRouter } from "./routers/tweetLikeRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tweet: tweetRouter,
  user: userRouter,
  tweetLike: tweetLikeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.tweet.add({ content: "Hello, world!" });
 */
export const createCaller = createCallerFactory(appRouter);
