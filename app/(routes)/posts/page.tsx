import { db } from "@/app/_utils/dbConnection";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import * as Avatar from "@radix-ui/react-avatar";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Separator from "@radix-ui/react-separator";
import LikeButton from "@/app/_components/LikeButton";
import { toggleLike } from "@/app/_actions/toggleLike";

export default async function PostsPage() {
  const { userId } = await auth();

  const postsQuery = await db.query(
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

  const posts = postsQuery.rows;

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
        {posts.map((post, index) => (
          <li key={post.id} className="space-y-4">
            {/* User Header */}
            <div className="flex items-center gap-3">
              <Avatar.Root
                className="inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-card-border)",
                  color: "var(--color-foreground)",
                }}
              >
                <Avatar.Fallback delayMs={0}>
                  {post.nickname[0].toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>

              <HoverCard.Root>
                <HoverCard.Trigger asChild>
                  <Link
                    href={`/profile/${post.nickname}`}
                    className="font-semibold transition"
                    style={{
                      color: "var(--color-accent)",
                    }}
                  >
                    {post.nickname}
                  </Link>
                </HoverCard.Trigger>

                <HoverCard.Portal>
                  <HoverCard.Content
                    sideOffset={5}
                    className="p-4 rounded-xl shadow max-w-xs"
                    style={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-card-border)",
                      color: "var(--color-foreground)",
                    }}
                  >
                    <p className="font-bold">{post.nickname}</p>
                    {post.bio && (
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--color-muted-foreground)" }}
                      >
                        {post.bio}
                      </p>
                    )}
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            </div>

            {/* Post Content */}
            <p
              className="p-4 rounded-xl leading-relaxed"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-card-border)",
              }}
            >
              {post.content}
            </p>

            {/* Like Button */}
            <LikeButton
              postId={post.id}
              isLiked={post.is_liked}
              likeCount={post.like_count}
              toggleLikeAction={toggleLike}
            />

            {/* Timestamp */}
            <span
              className="text-sm block"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {new Date(post.created_at).toLocaleString()}
            </span>

            {/* Separator */}
            {index < posts.length - 1 && (
              <Separator.Root
                className="h-px mt-6"
                style={{ backgroundColor: "var(--color-card-border)" }}
              />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
