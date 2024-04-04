import { produce } from "immer";
import { useSession } from "next-auth/react";
import { DefaultLayout } from "~/components/DefaultLayout";
import { TweetList } from "~/components/TweetList";
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const { data: tweets = [], isLoading } = api.tweet.getByFollowing.useQuery();
  const tweetLikeLikeOrUnlikeMutation =
    api.tweetLike.likeOrUnLike.useMutation();
  const utils = api.useUtils();

  function handleLikeClick(tweetId: string) {
    if (!session) {
      alert("ログインしてください。");
      return;
    }

    if (tweetLikeLikeOrUnlikeMutation.isPending) return;

    tweetLikeLikeOrUnlikeMutation.mutate(
      { tweetId },
      {
        onSuccess(data) {
          utils.tweet.getByFollowing.setData(undefined, (old) => {
            return produce(old, (draft) => {
              const tweet = draft?.find((t) => t.id === tweetId);
              if (!tweet) return draft;

              const likeIndex = tweet.likes.findIndex(
                (like) => like.userId === data.userId,
              );
              if (likeIndex === -1) {
                tweet.likes.push(data);
              } else {
                tweet.likes.splice(likeIndex, 1);
              }
            });
          });
        },
      },
    );
  }

  return (
    <DefaultLayout session={session}>
      <TweetList
        tweets={tweets}
        isLoading={isLoading}
        handleLikeClick={handleLikeClick}
        currentUserId={session?.user.id}
      />
    </DefaultLayout>
  );
}
