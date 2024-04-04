import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Error from "next/error";

import { DefaultLayout } from "~/components/DefaultLayout";
import { api } from "~/utils/api";
import Link from "next/link";
import { UserIcon } from "~/components/UserIcon";

export default function UserIdFollowing() {
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
          {user.name ?? "no name"} さんのフォロー一覧
          {user.following.map((followingUser) => (
            <div key={followingUser.id} className="flex gap-2 border p-4">
              <div className="h-12 w-12 shrink-0">
                <UserIcon {...followingUser.target} />
              </div>
              <div className="font-bold">
                <Link
                  href={`/${followingUser.target.id}`}
                  className="hover:underline"
                >
                  {followingUser.target.name ?? "no name"}
                </Link>
                <div className="text-sm text-slate-600">
                  @{followingUser.target.id}
                </div>
              </div>
            </div>
          ))}
          {user.following.length === 0 && (
            <div className="p-4">フォローしているユーザーはいません。</div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
