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

  async function createPost(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const raw = formData.get("content") as string | null;
    if (!raw) return;

    const content = raw.trim();

    if (content.length === 0) {
      throw new Error("Post cannot be blank.");
    }
    if (content.includes(" ")) {
      throw new Error("Posts must be a single word with no spaces.");
    }

    await db.query(
      `INSERT INTO social_media_posts (user_id, content) VALUES ($1, $2)`,
      [userId, content],
    );

    redirect(`/profile/${profile.nickname}`);
  }

  return (
    <main
      className="px-6 py-10 max-w-2xl mx-auto space-y-6"
      style={{ color: "var(--color-foreground)" }}
    >
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-accent)" }}
      >
        Create a Post
      </h1>

      <form action={createPost} className="space-y-4">
        <textarea
          name="content"
          placeholder="What's on your mind?"
          required
          title="Posts must be a single word with no spaces."
          className="w-full p-3 rounded-xl resize-none"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)",
            color: "var(--color-foreground)",
            minHeight: "140px",
          }}
        />

        <button
          className="
            px-4 py-2 rounded-lg font-medium transition
            hover:bg-var(--color-accent-hover)
          "
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
          }}
        >
          Post
        </button>
      </form>
    </main>
  );
}
