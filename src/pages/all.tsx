import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { DefaultLayout } from "~/components/DefaultLayout";
import { TweetList } from "~/components/TweetList";

export default function All() {
  const { data: session } = useSession();
  const {
    data: tweetData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.tweet.getAll.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const tweets = tweetData?.pages.flatMap((o) => [...o.tweets]) ?? [];

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <DefaultLayout session={session}>
      <TweetList tweets={tweets} isLoading={isLoading} />
      {isFetchingNextPage && <div className="loading">Loading...</div>}
      <div ref={ref}></div>
    </DefaultLayout>
  );
}
