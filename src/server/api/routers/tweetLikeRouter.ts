import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const tweetLikeRouter = createTRPCRouter({
  likeOrUnLike: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tweet = await ctx.db.tweet.findUnique({
        where: { id: input.tweetId },
        include: { likes: true },
      });

      if (!tweet) throw new TRPCError({ code: "BAD_REQUEST" });

      const like = tweet.likes.find(
        (like) => like.userId === ctx.session.user.id,
      );

      if (like) {
        return await ctx.db.tweetLike.delete({
          where: { id: like.id },
        });
      } else {
        return await ctx.db.tweetLike.create({
          data: { tweetId: tweet.id, userId: ctx.session.user.id },
        });
      }
    }),
});
