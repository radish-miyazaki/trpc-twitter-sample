import { createTRPCRouter, protectedProcedure } from "../trpc";
import { tweetContentSchema } from "~/validations/tweet";

export const tweetRouter = createTRPCRouter({
  add: protectedProcedure
    .input(tweetContentSchema)
    .mutation(async ({ ctx, input }) => {
      const { content } = input;
      const { user } = ctx.session;

      const tweet = await ctx.db.tweet.create({
        data: {
          content,
          userId: user.id,
        },
        include: {
          from: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          likes: true,
        },
      });

      return tweet;
    }),
});
