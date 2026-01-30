"use client";

type LikeButtonProps = {
  postId: string;
  isLiked: boolean;
  likeCount: number;
  toggleLikeAction: (formData: FormData) => void;
};

export default function LikeButton({
  postId,
  isLiked,
  likeCount,
  toggleLikeAction,
}: LikeButtonProps) {
  return (
    <form action={toggleLikeAction} className="flex items-center gap-2">
      <input type="hidden" name="postId" value={postId} />

      <button
        className={`
          px-3 py-1 rounded font-medium transition
          ${isLiked ? "bg-red-500 text-white hover:bg-red-800" : ""}
        `}
        style={{
          backgroundColor: isLiked ? undefined : "var(--color-card)",
          border: isLiked ? "none" : "1px solid var(--color-card-border)",
          color: isLiked ? undefined : "var(--color-muted-foreground)",
        }}
        onMouseEnter={(e) => {
          if (!isLiked) {
            e.currentTarget.style.backgroundColor = "var(--color-card-border)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLiked) {
            e.currentTarget.style.backgroundColor = "var(--color-card)";
          }
        }}
      >
        {isLiked ? "♥" : "♡"}
      </button>

      <span
        className="text-sm"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        {likeCount}
      </span>
    </form>
  );
}
