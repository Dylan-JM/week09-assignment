import { db } from "@/app/_utils/dbConnection";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ProfileEditor from "@/app/_components/ProfileEditor";
import PostEditor from "@/app/_components/PostEditor";
import LikeButton from "@/app/_components/LikeButton";
import { toggleLike } from "@/app/_actions/toggleLike";
import * as Avatar from "@radix-ui/react-avatar";

type ProfilePageProps = {
  params: { username: string };
};

type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  like_count: number;
  is_liked: boolean;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const { userId } = await auth();

  const profileQuery = await db.query(
    `SELECT * FROM profiles WHERE nickname = $1`,
    [username],
  );

  const profile = profileQuery.rows[0];
  if (!profile) notFound();

  const postsQuery = await db.query<Post>(
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
          WHERE l.post_id = p.id AND l.user_id = $1
        )
      ) AS is_liked
    FROM social_media_posts p
    WHERE p.user_id = $2
    ORDER BY p.created_at DESC
    `,
    [userId, profile.user_id],
  );

  const posts = postsQuery.rows;

  async function deletePost(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const postId = formData.get("postId") as string;

    await db.query(
      `DELETE FROM social_media_posts WHERE id = $1 AND user_id = $2`,
      [postId, userId],
    );

    redirect(`/profile/${profile.nickname}`);
  }

  async function updatePost(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;

    await db.query(
      `UPDATE social_media_posts SET content = $1 WHERE id = $2 AND user_id = $3`,
      [content, postId, userId],
    );

    redirect(`/profile/${profile.nickname}`);
  }

  async function updateProfile(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const nickname = formData.get("nickname") as string;
    const bio = formData.get("bio") as string;

    await db.query(
      `UPDATE profiles SET nickname = $1, bio = $2 WHERE user_id = $3`,
      [nickname, bio, userId],
    );

    redirect(`/profile/${nickname}`);
  }

  return (
    <main className="px-6 py-10 space-y-10 max-w-2xl mx-auto">
      {/* PROFILE HEADER */}
      <section className="space-y-4 border-l-4 border-blue-500 pl-4">
        <div className="flex items-center gap-4">
          <Avatar.Root
            className="
              inline-flex items-center justify-center
              w-14 h-14 rounded-full
              bg-white border border-gray-300 shadow-sm
              text-blue-600 text-2xl font-bold
            "
          >
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

      {/* POSTS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">
          Posts by {profile.nickname}
        </h2>

        {posts.length === 0 && (
          <p className="opacity-70">This user has not posted yet.</p>
        )}

        <ul className="space-y-8">
          {posts.map((post: Post) => (
            <li
              key={post.id}
              className="bg-white border border-gray-200 shadow-sm p-5 rounded-xl space-y-3"
            >
              <PostEditor
                post={post}
                updatePostAction={updatePost}
                deletePostAction={deletePost}
                isOwner={userId === profile.user_id}
              />

              <LikeButton
                postId={post.id}
                isLiked={post.is_liked}
                likeCount={post.like_count}
                toggleLikeAction={toggleLike}
              />

              <span className="text-sm text-gray-500 block">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
