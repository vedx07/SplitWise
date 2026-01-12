import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { NotificationDropbox } from "./NotificationDropbox.jsx";
import { UserContext } from "../context/userContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { avatarUrl, name } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [isNotificationDropboxOpen, setIsNotificationDropboxOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  const avatarRef = useRef(null);

  const navLink = (path) =>
    location.pathname === path
      ? "text-white font-medium"
      : "text-gray-400 hover:text-white";

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Bad response from server");
      }

      navigate("/");
      window.location.reload(); // optional but safe
    } catch (err) {
      console.error(err);
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="relative z-50 bg-[#0d1117] border-b border-[#242a33]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}

        <h1 className="text-lg font-semibold text-white tracking-tight">
          Split<span className="text-green-400">wise</span>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link to="/dashboard" className={navLink("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/groups" className={navLink("/groups")}>
            Groups
          </Link>
          <Link to="/friends" className={navLink("/friends")}>
            Friends
          </Link>
          <Link to="/profile" className={navLink("/profile")}>
            Profile
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <div
              onClick={() =>
                setIsNotificationDropboxOpen(!isNotificationDropboxOpen)
              }
              className="w-8 h-8 flex items-center justify-center border border-[#242a33] rounded-md text-gray-300 cursor-pointer hover:bg-[#161b22]"
            >
              🔔
            </div>

            <span className="absolute -top-1 -right-1 bg-white text-black text-xs px-1 rounded">
              2
            </span>

            {isNotificationDropboxOpen && <NotificationDropbox />}
          </div>

          {/* Avatar */}
          <div ref={avatarRef} className="relative">
            <div
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              className="w-9 h-9 rounded-full border border-[#242a33] overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-500"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#161b22] text-white text-sm font-semibold">
                  {name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* Avatar Dropdown */}
            {isAvatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0d1117] border border-[#242a33] rounded-md shadow-lg text-sm">
                <Link
                  to="/profile"
                  onClick={() => setIsAvatarMenuOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:bg-[#161b22]"
                >
                  Profile
                </Link>

                <button
                  onClick={logout}
                  disabled={loading}
                  className={`w-full text-left px-4 py-2 text-red-400
                    ${
                      loading
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-[#161b22]"
                    }`}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 text-xl"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm bg-[#0d1117] border-t border-[#242a33]">
          <Link
            to="/dashboard"
            className={navLink("/dashboard")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/groups"
            className={navLink("/groups")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Groups
          </Link>
          <Link
            to="/friends"
            className={navLink("/friends")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Friends
          </Link>
          <Link
            to="/profile"
            className={navLink("/profile")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>
        </nav>
      )}
    </header>
  );
}
