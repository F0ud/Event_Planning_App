"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Search, Plus, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const userRole = (session?.user as Record<string, unknown>)?.role;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">
                Cultura
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/experiences"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Explore
              </Link>
              {session && userRole === "HOST" && (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                {userRole === "HOST" && (
                  <Link
                    href="/experiences/new"
                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Create Experience
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <User className="w-4 h-4" />
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/experiences"
              className="block py-2 text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </Link>
            {session ? (
              <>
                {userRole === "HOST" && (
                  <>
                    <Link
                      href="/experiences/new"
                      className="block py-2 text-gray-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Create Experience
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block py-2 text-gray-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                <Link
                  href="/profile"
                  className="block py-2 text-gray-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="block py-2 text-gray-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block py-2 text-gray-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2 text-indigo-600 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
