import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  type TweetContentSchema,
  tweetContentSchema,
} from "~/validations/tweet";
import { api } from "~/utils/api";
import { DefaultLayout } from "~/components/DefaultLayout";
import Error from "next/error";
import { UserIcon } from "~/components/UserIcon";

export default function UserIdIndex() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(tweetContentSchema),
    defaultValues: { content: "" },
  });

  const userId = String(router.query.userId);
  const { data: user, isLoading } = api.user.getByUserId.useQuery(
    { userId },
    {
      enabled: router.isReady,
    },
  );
  const tweetAddMutation = api.tweet.add.useMutation();

  if (isLoading) {
    return (
      <DefaultLayout session={session}>
        <div>Loading...</div>
      </DefaultLayout>
    );
  }

  if (!user) {
    return <Error statusCode={404} />;
  }

  function onSubmit({ content }: TweetContentSchema) {
    if (tweetAddMutation.isPending) return;

    tweetAddMutation.mutate({ content });
    reset();
  }

  return (
    <DefaultLayout session={session}>
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <div className="h-24 w-24">
            <UserIcon {...user} />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user?.name ?? "no name"}</h1>
          <p className="text-slate-700">@{user?.id ?? "---"}</p>
        </div>
      </div>
      <div className="my-4">
        {userId === session?.user.id && (
          <form
            className="flex flex-col items-end gap-2"
            onSubmit={(e) => handleSubmit(onSubmit)(e)}
          >
            <textarea
              {...register("content")}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-slate-900"
              placeholder="いまどうしてる？"
              minLength={1}
              maxLength={140}
            ></textarea>
            <button
              className="rounded-full bg-sky-500 px-5 py-3 text-white disabled:opacity-50"
              disabled={!isValid || tweetAddMutation.isPending}
            >
              ツイートする
            </button>
          </form>
        )}
      </div>
    </DefaultLayout>
  );
}