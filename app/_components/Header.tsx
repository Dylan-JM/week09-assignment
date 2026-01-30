import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/app/_utils/dbConnection";
import { SignOutButton } from "@clerk/nextjs";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";

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
    <header className="w-full bg-blue-600 text-white p-4">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex items-center gap-6">
          {/* Home */}
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          {/* Posts */}
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/posts" className="hover:underline">
                Posts
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          {/* Create Post */}
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/posts/create-post" className="hover:underline">
                Create Post
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <div className="ml-auto" />

          {/* User Dropdown */}
          {nickname && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="outline-none">
                  <Avatar.Root className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                    <Avatar.Fallback delayMs={0}>
                      {nickname[0].toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={5}
                  className="bg-gray-800 text-white rounded shadow p-2 min-w-[150px]"
                >
                  <DropdownMenu.Item asChild>
                    <Link
                      href={`/profile/${nickname}`}
                      className="block px-2 py-1 hover:bg-gray-700 rounded"
                    >
                      My Profile
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-gray-700 my-2" />

                  <DropdownMenu.Item asChild>
                    <SignOutButton redirectUrl="/sign-in">
                      <div className="px-2 py-1 hover:bg-gray-700 rounded cursor-pointer">
                        Sign Out
                      </div>
                    </SignOutButton>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>
  );
}
