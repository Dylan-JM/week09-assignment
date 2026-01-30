"use client";

export default function FollowButton({
  targetUserId,
  isFollowing,
  toggleFollowAction,
}) {
  return (
    <form action={toggleFollowAction}>
      <input type="hidden" name="targetUserId" value={targetUserId} />

      <button
        className={`
        px-3 py-1 rounded font-medium transition
        ${isFollowing ? "border" : "text-white"}
      `}
        style={{
          backgroundColor: isFollowing
            ? "var(--color-card)"
            : "var(--color-accent)",
          borderColor: isFollowing ? "var(--color-card-border)" : "transparent",
          color: isFollowing ? "var(--color-muted-foreground)" : "white",
        }}
        onMouseEnter={(e) => {
          if (isFollowing) {
            e.currentTarget.style.backgroundColor = "var(--color-danger)";
            e.currentTarget.style.color = "white";
          } else {
            e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (isFollowing) {
            e.currentTarget.style.backgroundColor = "var(--color-card)";
            e.currentTarget.style.color = "var(--color-muted-foreground)";
          } else {
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
          }
        }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
}
