import { db } from "@/app/_utils/dbConnection";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }) {
  const { username } = await params;

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

  return (
    <main className="px-6 py-10 space-y-10">
      <section className="space-y-2 border-l-4 border-blue-500 pl-4">
        <h1 className="text-3xl font-bold text-blue-500">{profile.nickname}</h1>

        {profile.bio && <p className="opacity-80">{profile.bio}</p>}

        {profile.age && (
          <p className="opacity-60 text-sm">Age: {profile.age}</p>
        )}
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
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
