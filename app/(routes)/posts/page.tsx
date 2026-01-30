import { db } from "@/app/_utils/dbConnection";
import Link from "next/link";

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
    <main className="px-6 py-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">All Posts</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow">
            <Link
              href={`/profile/${post.nickname}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {post.nickname}
            </Link>

            <p className="text-gray-800 mt-2">{post.content}</p>

            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
