import { db } from "@/app/_utils/dbConnection";

export default async function PostsPage() {
  const postsQuery = await db.query(
    `SELECT * FROM social_media_posts ORDER BY created_at DESC`,
  );

  const posts = postsQuery.rows;

  return (
    <main className="px-6 py-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">All Posts</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow">
            <p className="text-gray-800">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
