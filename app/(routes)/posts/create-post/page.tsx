import { db } from "@/app/_utils/dbConnection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function CreatePostPage() {
  async function createPost(formData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const content = formData.get("content");

    await db.query(
      `INSERT INTO social_media_posts (user_id, content) VALUES ($1, $2)`,
      [userId, content],
    );

    redirect("/posts");
  }

  return (
    <main className="px-6 py-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">Create a Post</h1>

      <form
        action={createPost}
        className="space-y-4 border p-6 rounded-lg shadow"
      >
        <div className="flex flex-col">
          <label>Content</label>
          <textarea name="content" required className="border p-2 rounded" />
        </div>

        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Post
        </button>
      </form>
    </main>
  );
}
