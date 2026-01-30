import { db } from "@/app/_utils/dbConnection";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileEditor from "@/app/_components/ProfileEditor";
import PostEditor from "@/app/_components/PostEditor";
import * as Avatar from "@radix-ui/react-avatar";
import LikeButton from "@/app/_components/LikeButton";
import { toggleLike } from "@/app/_actions/toggleLike";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const { userId } = await auth();

  const profileQuery = await db.query(
    `SELECT * FROM profiles WHERE nickname = $1`,
    [username],
  );

  const profile = profileQuery.rows[0];

  if (!profile) {
    notFound();
  }

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

  async function updatePost(formData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const postId = formData.get("postId");
    const content = formData.get("content");

    await db.query(
      `UPDATE social_media_posts SET content = $1 WHERE id = $2 AND user_id = $3`,
      [content, postId, userId],
    );

    redirect(`/profile/${profile.nickname}`);
  }

  async function updateProfile(formData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const nickname = formData.get("nickname");
    const bio = formData.get("bio");

    await db.query(
      `UPDATE profiles SET nickname = $1, bio = $2 WHERE user_id = $3`,
      [nickname, bio, userId],
    );

    redirect(`/profile/${nickname}`);
  }

  return (
    <main className="px-6 py-10 space-y-10 max-w-2xl mx-auto">
      <section className="space-y-4 border-l-4 border-blue-500 pl-4">
        <div className="flex items-center gap-4">
          <Avatar.Root className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-2xl">
            <Avatar.Fallback delayMs={0}>
              {profile.nickname[0].toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>

          <ProfileEditor
            profile={profile}
            updateProfileAction={updateProfile}
            isOwner={userId === profile.user_id}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">
          Posts by {profile.nickname}
        </h2>

        {posts.length === 0 && (
          <p className="opacity-70">This user has not posted yet.</p>
        )}

        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-gray-600 border border-gray-800 p-4 rounded-lg"
            >
              <PostEditor
                post={post}
                updatePostAction={updatePost}
                deletePostAction={deletePost}
                isOwner={userId === profile.user_id}
              />

              <span className="opacity-60 text-sm block mt-2">
                {new Date(post.created_at).toLocaleString()}
              </span>

              <LikeButton
                postId={post.id}
                isLiked={post.is_liked}
                likeCount={post.like_count}
                toggleLikeAction={toggleLike}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
