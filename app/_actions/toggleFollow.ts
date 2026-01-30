"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_utils/dbConnection";
import { revalidatePath } from "next/cache";

export async function toggleFollow(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return;

  const targetUserId = formData.get("targetUserId") as string;
  if (!targetUserId) return;

  const existing = await db.query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [userId, targetUserId],
  );

  if (existing.rows.length > 0) {
    await db.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [userId, targetUserId],
    );
  } else {
    await db.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
      [userId, targetUserId],
    );
  }

  revalidatePath(`/profile/${targetUserId}`);
}
