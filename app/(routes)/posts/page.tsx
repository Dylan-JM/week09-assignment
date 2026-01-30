import { db } from "@/app/_utils/dbConnection";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import * as Avatar from "@radix-ui/react-avatar";
import * as HoverCard from "@radix-ui/react-hover-card";
import LikeButton from "@/app/_components/LikeButton";
import { toggleLike } from "@/app/_actions/toggleLike";

export default async function PostsPage() {
  const { userId } = await auth();

  type Post = {
    id: string;
    user_id: string;
    content: string;
    created_at: string;

    nickname: string;
    bio: string | null;

    like_count: number;
    is_liked: boolean;
  };

  const postsQuery = await db.query<Post>(
    `
    SELECT 
      p.*,
      profiles.nickname,
      profiles.bio,
      (
        SELECT COUNT(*) 
        FROM social_media_post_likes l 
        WHERE l.post_id = p.id
      ) AS like_count,
      (
        SELECT EXISTS(
          SELECT 1 
          FROM social_media_post_likes l 
          WHERE l.post_id = p.id AND l.user_id = $1
        )
      ) AS is_liked
    FROM social_media_posts p
    JOIN profiles ON profiles.user_id = p.user_id
    ORDER BY p.created_at DESC
    `,
    [userId],
  );

  const posts: Post[] = postsQuery.rows;

  return (
    <main
      className="px-6 py-10 max-w-2xl mx-auto space-y-10"
      style={{ color: "var(--color-foreground)" }}
    >
      <h1
        className="text-3xl font-bold"
        style={{ color: "var(--color-accent)" }}
      >
        Latest Posts
      </h1>

      {posts.length === 0 && (
        <p style={{ color: "var(--color-muted-foreground)" }}>
          No posts yet. Be the first to share something.
        </p>
      )}

      <ul className="space-y-10">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-4"
          >
            {/* User Header */}
            <div className="flex items-center gap-3">
              <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold bg-gray-100 border border-gray-300 text-gray-700">
                <Avatar.Fallback delayMs={0}>
                  {post.nickname[0].toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>

              <HoverCard.Root>
                <HoverCard.Trigger asChild>
                  <Link
                    href={`/profile/${post.nickname}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {post.nickname}
                  </Link>
                </HoverCard.Trigger>

                <HoverCard.Portal>
                  <HoverCard.Content
                    sideOffset={5}
                    className="p-4 rounded-xl shadow max-w-xs bg-white border border-gray-200"
                  >
                    <p className="font-bold">{post.nickname}</p>
                    {post.bio && (
                      <p className="text-sm mt-1 text-gray-500">{post.bio}</p>
                    )}
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            </div>

            {/* Post Content */}
            <p className="leading-relaxed text-gray-800">{post.content}</p>

            {/* Like Button */}
            <LikeButton
              postId={post.id}
              isLiked={post.is_liked}
              likeCount={post.like_count}
              toggleLikeAction={toggleLike}
            />

            {/* Timestamp */}
            <span className="text-sm text-gray-500 block">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
