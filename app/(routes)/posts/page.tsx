import { db } from "@/app/_utils/dbConnection";
import Link from "next/link";
import * as Avatar from "@radix-ui/react-avatar";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Separator from "@radix-ui/react-separator";

export default async function PostsPage() {
  const postsQuery = await db.query(
    `
    SELECT social_media_posts.*, profiles.nickname
    FROM social_media_posts
    JOIN profiles ON profiles.user_id = social_media_posts.user_id
    ORDER BY social_media_posts.created_at DESC
    `,
  );

  const posts = postsQuery.rows;

  return (
    <main className="px-6 py-10 max-w-2xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-blue-500">Latest Posts</h1>

      {posts.length === 0 && (
        <p className="opacity-70">
          No posts yet. Be the first to share something.
        </p>
      )}

      <ul className="space-y-10">
        {posts.map((post, index) => (
          <li key={post.id} className="space-y-4">
            {/* User Header */}
            <div className="flex items-center gap-3">
              <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
                <Avatar.Fallback delayMs={0}>
                  {post.nickname[0].toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>

              <HoverCard.Root>
                <HoverCard.Trigger asChild>
                  <Link
                    href={`/profile/${post.nickname}`}
                    className="font-semibold text-blue-400 hover:underline"
                  >
                    {post.nickname}
                  </Link>
                </HoverCard.Trigger>

                <HoverCard.Portal>
                  <HoverCard.Content
                    sideOffset={5}
                    className="bg-gray-800 text-white p-4 rounded shadow max-w-xs"
                  >
                    <p className="font-bold">{post.nickname}</p>
                    {post.bio && (
                      <p className="opacity-70 text-sm mt-1">{post.bio}</p>
                    )}
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            </div>

            <p className="bg-gray-600 border border-gray-800 p-4 rounded-lg">
              {post.content}
            </p>

            <span className="opacity-60 text-sm block">
              {new Date(post.created_at).toLocaleString()}
            </span>

            {index < posts.length - 1 && (
              <Separator.Root className="h-px bg-gray-700 mt-6" />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
