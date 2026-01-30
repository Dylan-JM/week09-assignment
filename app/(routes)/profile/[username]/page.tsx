import { db } from "@/app/_utils/dbConnection";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import LikeButton from "@/app/_components/LikeButton";
import FollowButton from "@/app/_components/FollowButton";
import { toggleLike } from "@/app/_actions/toggleLike";
import { toggleFollow } from "@/app/_actions/toggleFollow";
import { redirect } from "next/navigation";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const { userId } = await auth();

  const profileQuery = await db.query(
    `
    SELECT 
      p.*,
      (SELECT COUNT(*) FROM follows f WHERE f.following_id = p.user_id) AS follower_count,
      (SELECT COUNT(*) FROM follows f WHERE f.follower_id = p.user_id) AS following_count,
      (
        SELECT EXISTS(
          SELECT 1 
          FROM follows f 
          WHERE f.follower_id = $2 AND f.following_id = p.user_id
        )
      ) AS is_following
    FROM profiles p
    WHERE p.nickname = $1
  `,
    [username, userId],
  );

  if (profileQuery.rows.length === 0) {
    notFound();
  }

  const profile = profileQuery.rows[0];

  const postsQuery = await db.query(
    `
    SELECT 
      p.*,
      (
        SELECT COUNT(*) 
        FROM social_media_post_likes l 
        WHERE l.post_id = p.id
      ) AS like_count,
      (
        SELECT EXISTS(
          SELECT 1 
          FROM social_media_post_likes l 
          WHERE l.post_id = p.id AND l.user_id = $2
        )
      ) AS is_liked
    FROM social_media_posts p
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
    `,
    [profile.user_id, userId],
  );

  const posts = postsQuery.rows;

  async function deletePost(formData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const postId = formData.get("postId");

    await db.query(
      `DELETE FROM social_media_posts WHERE id = $1 AND user_id = $2`,
      [postId, userId],
    );

    redirect(`/profile/${profile.nickname}`);
  }

  return (
    <main
      className="px-6 py-10 max-w-2xl mx-auto space-y-10"
      style={{ color: "var(--color-foreground)" }}
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-accent)" }}
          >
            {profile.nickname}
          </h1>

          {profile.bio && (
            <p
              className="mt-1"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {profile.bio}
            </p>
          )}

          <div
            className="flex gap-4 mt-2 text-sm"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            <span>{profile.follower_count} Followers</span>
            <span>{profile.following_count} Following</span>
          </div>
        </div>

        {userId && userId !== profile.user_id && (
          <FollowButton
            targetUserId={profile.user_id}
            isFollowing={profile.is_following}
            toggleFollowAction={toggleFollow}
          />
        )}
      </div>

      {/* Posts Header */}
      <h2
        className="text-xl font-semibold"
        style={{ color: "var(--color-accent)" }}
      >
        Posts
      </h2>

      {posts.length === 0 && (
        <p style={{ color: "var(--color-muted-foreground)" }}>
          This user hasn&apos;t posted anything yet.
        </p>
      )}

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.id} className="space-y-3">
            {/* Post Card */}
            <p className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl">
              {post.content}
            </p>

            <LikeButton
              postId={post.id}
              isLiked={post.is_liked}
              likeCount={post.like_count}
              toggleLikeAction={toggleLike}
            />

            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </span>

            {userId === profile.user_id && (
              <form action={deletePost} className="flex justify-end">
                <input type="hidden" name="postId" value={post.id} />

                <button
                  className="
              bg-red-600 text-white px-3 py-1 rounded
              hover:bg-red-700 transition
            "
                >
                  Delete
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
