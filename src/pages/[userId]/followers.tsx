import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Error from "next/error";

import { DefaultLayout } from "~/components/DefaultLayout";
import { api } from "~/utils/api";
import Link from "next/link";
import { UserIcon } from "~/components/UserIcon";

export default function UserIdFollowers() {
  const router = useRouter();
  const userId = String(router.query.userId);
  const { data: session } = useSession();
  const { data: user, isLoading } = api.user.getByUserId.useQuery(
    { userId },
    {
      enabled: router.isReady,
    },
  );

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

  return (
    <DefaultLayout session={session}>
      <div>
        <div className="border p-4 font-bold">
          {user.name ?? "no name"} さんのフォロワー一覧
          {user.followers.map((follower) => (
            <div key={follower.id} className="flex gap-2 border p-4">
              <div className="h-12 w-12 shrink-0">
                <UserIcon {...follower.user} />
              </div>
              <div className="font-bold">
                <Link href={`/${follower.user.id}`} className="hover:underline">
                  {follower.user.name ?? "no name"}
                </Link>
                <div className="text-sm text-slate-600">
                  @{follower.user.id}
                </div>
              </div>
            </div>
          ))}
          {user.followers.length === 0 && (
            <div className="p-4">フォロワーはいません。</div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
