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
        className={`px-3 py-1 rounded ${
          isFollowing ? "bg-gray-700" : "bg-blue-600"
        } text-white hover:bg-blue-700`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
}
