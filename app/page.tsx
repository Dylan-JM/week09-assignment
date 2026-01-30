"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="px-6 py-20 max-w-3xl mx-auto text-center space-y-8"
      style={{ color: "var(--color-foreground)" }}
    >
      <h1
        className="text-5xl font-bold"
        style={{ color: "var(--color-accent)" }}
      >
        Welcome to the Social Media App
      </h1>

      <p
        className="text-lg max-w-xl mx-auto"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        A simple place to share your thoughts, connect with others, and explore
        what everyone is posting.
      </p>

      <div className="flex justify-center gap-4 mt-10">
        {/* View Posts Button */}
        <Link
          href="/posts"
          className="px-6 py-3 rounded-lg font-medium transition"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-accent-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-accent)")
          }
        >
          View Posts
        </Link>

        {/* Create Post Button */}
        <Link
          href="/posts/create-post"
          className="px-6 py-3 rounded-lg font-medium transition"
          style={{
            backgroundColor: "var(--color-card)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-card-border)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-card-border)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-card)")
          }
        >
          Create Post
        </Link>
      </div>
    </main>
  );
}
