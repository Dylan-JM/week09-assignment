import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_utils/dbConnection";
import { SignOutButton } from "@clerk/nextjs";

export default async function Header() {
  const { userId } = await auth();

  let nickname = null;

  if (userId) {
    const profile = await db.query(
      `SELECT nickname FROM profiles WHERE user_id = $1`,
      [userId],
    );
    if (profile.rows.length > 0) {
      nickname = profile.rows[0].nickname;
    }
  }

  return (
    <header className="w-full bg-blue-600 text-white p-4 flex gap-6">
      <Link href="/posts" className="hover:underline">
        Posts
      </Link>
      <Link href="/posts/create-post" className="hover:underline">
        Create Post
      </Link>

      {nickname && (
        <Link href={`/profile/${nickname}`} className="hover:underline">
          My Profile
        </Link>
      )}

      <SignOutButton redirectUrl="/sign-in">
        <div className="ml-auto cursor-pointer hover:underline">Sign Out</div>
      </SignOutButton>
    </header>
  );
}
