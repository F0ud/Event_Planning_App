import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold text-indigo-600">Cultura</span>
            <p className="mt-2 text-sm text-gray-500">
              Discover authentic cultural experiences. Connect with local hosts
              offering artisan workshops, culinary classes, wellness retreats,
              and more.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Explore
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/experiences?category=CULINARY"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Culinary
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences?category=ARTISAN"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Artisan
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences?category=WELLNESS"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences?category=CULTURAL"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Cultural
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Host
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/auth/signup"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Host Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-gray-500">
                  help@cultura.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Cultura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
