import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-[#0f1115]">
      <div className="text-center max-w-sm
                      bg-[#161a20]
                      border border-[#242a33]
                      p-6
                      rounded-md">

        <h1 className="text-6xl font-medium text-gray-100 mb-3">
          404
        </h1>

        <p className="text-base text-gray-100 mb-1">
          Page not found
        </p>

        <p className="text-sm text-gray-400 mb-6">
          The page you’re trying to access doesn’t exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-block
                     bg-gray-100 text-black
                     px-6 py-2
                     rounded-sm
                     hover:bg-white transition"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
