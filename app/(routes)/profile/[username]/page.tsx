import { db } from "@/app/_utils/dbConnection";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileEditor from "@/app/_components/ProfileEditor";

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
    `SELECT * FROM social_media_posts WHERE user_id = $1 ORDER BY created_at DESC`,
    [profile.user_id],
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
    <main className="px-6 py-10 space-y-10">
      <section className="space-y-2 border-l-4 border-blue-500 pl-4">
        <ProfileEditor
          profile={profile}
          updateProfileAction={updateProfile}
          isOwner={userId === profile.user_id}
        />
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
              <p className="mb-2">{post.content}</p>

              <span className="opacity-60 text-sm">
                {new Date(post.created_at).toLocaleString()}
              </span>

              {userId === profile.user_id && (
                <form action={deletePost} className="mt-3">
                  <input type="hidden" name="postId" value={post.id} />
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Delete
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
