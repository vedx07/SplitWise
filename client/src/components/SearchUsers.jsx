import { useEffect, useState } from "react";

export default function SearchUsers({ friends, requests }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // TEMPORARY STATE FOR SENT REQUESTS
  const [tempRequested, setTempRequested] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3000/search-users?q=${query}`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Search failed");

        setResults(data);
        setHasSearched(true);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const isFriend = (id) => friends.some((f) => f._id === id);

  // USE TEMP STATE HERE
  const isRequested = (id) =>
    requests.some((r) => r._id === id) ||
    tempRequested.includes(id);

  // ADD FRIEND REQUEST (TEMPORARY)
  const sendFriendRequest = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/send-friend-request/${userId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Backend says already sent → sync UI
        if (data.message === "Request already sent") {
          setTempRequested((prev) => [...prev, userId]);
          return;
        }
        throw new Error(data.message);
      }

      // Success then mark as requested
      setTempRequested((prev) => [...prev, userId]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-2 relative">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search users by name or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded bg-[#161b22] border border-[#30363d]
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Searching */}
      {loading && (
        <p className="text-sm text-gray-400 px-1">Searching...</p>
      )}

      {/* No users found */}
      {!loading && hasSearched && results.length === 0 && (
        <p className="p-4 text-sm text-gray-400">No users found.</p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div
          className="bg-[#161b22] border border-[#30363d] rounded divide-y divide-[#30363d]
                     max-h-72 overflow-y-auto
                     scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent"
        >
          {results.map((user) => {
            const firstLetter = user.name?.charAt(0).toUpperCase();

            return (
              <div
                key={user._id}
                className="flex items-center justify-between px-4 py-2
                           hover:bg-[#21262d] transition"
              >
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2d333b]
                                  flex items-center justify-center
                                  text-white font-semibold overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      firstLetter
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                {/* Right: Status / Action */}
                {isFriend(user._id) ? (
                  <span className="text-green-500 text-sm">Friend</span>
                ) : isRequested(user._id) ? (
                  <span className="text-yellow-500 text-sm">Requested</span>
                ) : (
                  <button
                    onClick={() => sendFriendRequest(user._id)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
