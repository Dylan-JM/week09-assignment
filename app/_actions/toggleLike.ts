"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_utils/dbConnection";
import { revalidatePath } from "next/cache";

export async function toggleLike(formData) {
  const { userId } = await auth();
  if (!userId) return;

  const postId = formData.get("postId");

  const existing = await db.query(
    `SELECT 1 FROM social_media_post_likes WHERE user_id = $1 AND post_id = $2`,
    [userId, postId],
  );

  if (existing.rows.length > 0) {
    await db.query(
      `DELETE FROM social_media_post_likes WHERE user_id = $1 AND post_id = $2`,
      [userId, postId],
    );
  } else {
    await db.query(
      `INSERT INTO social_media_post_likes (user_id, post_id) VALUES ($1, $2)`,
      [userId, postId],
    );
  }

  revalidatePath("/posts");
  revalidatePath("/profile");
}
