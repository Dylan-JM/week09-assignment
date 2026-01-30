import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold text-blue-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="opacity-70 mb-6 max-w-md">
        The page you`re looking for doesn`t exist or may have been moved.
      </p>
      <Link href={`/`} className="hover:underline">
        Home Page
      </Link>
    </main>
  );
}
