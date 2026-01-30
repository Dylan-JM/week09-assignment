export default function HomePage() {
  return (
    <main className="px-6 py-20 max-w-3xl mx-auto text-center space-y-8">
      <h1 className="text-5xl font-bold text-blue-500">
        Welcome to the Social Media App
      </h1>

      <p className="text-lg opacity-80 max-w-xl mx-auto">
        A simple place to share your thoughts, connect with others, and explore
        what everyone is posting.
      </p>

      <div className="flex justify-center gap-4 mt-10">
        <a
          href="/posts"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          View Posts
        </a>

        <a
          href="/posts/create-post"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Create Post
        </a>
      </div>
    </main>
  );
}
