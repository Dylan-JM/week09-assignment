import { db } from "@/app/_utils/dbConnection";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.query(`SELECT * FROM profiles WHERE user_id = $1`, [
    userId,
  ]);

  if (existing.rows.length > 0) {
    redirect(`/profile/${existing.rows[0].nickname}`);
  }

  async function createProfile(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) return;

    const nickname = formData.get("nickname");
    const bio = formData.get("bio");

    await db.query(
      `INSERT INTO profiles (user_id, bio, nickname) VALUES ($1, $2, $3)`,
      [userId, bio, nickname],
    );

    revalidatePath("/");
    redirect("/profile");
  }

  return (
    <main className="px-6 py-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">Create Your Profile</h1>

      <form
        action={createProfile}
        className="space-y-4 border p-6 rounded-lg shadow"
      >
        <div className="flex flex-col">
          <label>Nickname</label>
          <input
            type="text"
            name="nickname"
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Bio</label>
          <textarea name="bio" className="border p-2 rounded" />
        </div>

        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </main>
  );
}
