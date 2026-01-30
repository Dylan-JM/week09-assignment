import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/app/_utils/dbConnection";

export default async function CreatePostPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profileQuery = await db.query(
    `SELECT * FROM profiles WHERE user_id = $1`,
    [userId],
  );

  const profile = profileQuery.rows[0];

  if (!profile) {
    redirect("/profile");
  }

  async function createPost(formData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const content = formData.get("content");

    await db.query(
      `INSERT INTO social_media_posts (user_id, content) VALUES ($1, $2)`,
      [userId, content],
    );

    redirect(`/profile/${profile.nickname}`);
  }

  return (
    <main className="px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Create a Post</h1>

      <form action={createPost} className="space-y-4">
        <textarea
          name="content"
          className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded"
          placeholder="What's on your mind?"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Post
        </button>
      </form>
    </main>
  );
}
