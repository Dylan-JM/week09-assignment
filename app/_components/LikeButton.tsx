"use client";

export default function LikeButton({
  postId,
  isLiked,
  likeCount,
  toggleLikeAction,
}) {
  return (
    <form action={toggleLikeAction} className="flex items-center gap-2">
      <input type="hidden" name="postId" value={postId} />

      <button
        className={`px-3 py-1 rounded ${
          isLiked ? "bg-pink-600" : "bg-gray-700"
        } text-white hover:bg-pink-700`}
      >
        {isLiked ? "♥" : "♡"}
      </button>

      <span className="text-sm opacity-80">{likeCount}</span>
    </form>
  );
}
