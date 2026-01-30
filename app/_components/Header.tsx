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
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/posts" className="hover:underline">
                Posts
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <Link href="/posts/create-post" className="hover:underline">
                Create Post
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <div className="ml-auto" />

          {!nickname && userId && (
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/profile"
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Create Profile
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )}

          {nickname && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="outline-none">
                  <Avatar.Root className=" w-9 h-9 rounded-full bg-white border border-gray-300  text-blue-600 flex items-center justify-center font-bold shadow-sm">
                    <Avatar.Fallback delayMs={0}>
                      {nickname[0].toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={5}
                  className=" bg-white border border-gray-200 shadow-lg rounded-xl p-2 min-w-37.5 "
                >
                  {" "}
                  <DropdownMenu.Item asChild>
                    <Link
                      href={`/profile/${nickname}`}
                      className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                      My Profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
                  <DropdownMenu.Item asChild>
                    <SignOutButton redirectUrl="/sign-in">
                      <div className=" px-3 py-2 rounded-md cursor-pointer  text-red-600 hover:bg-red-50 transition ">
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
