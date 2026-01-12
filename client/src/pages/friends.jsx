import { useEffect, useState } from "react";
import FriendCard from "../components/FriendCard";
import FriendRequestCard from "../components/FriendRequestCard";
import SearchUsers from "../components/SearchUsers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:3000/user-friends", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch friends");
        }

        setFriends(data.friends || []);
        setRequests(data.friendRequests || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  //  ACCEPT FRIEND REQUEST
  const acceptFriendRequest = async (userId) => {
    try {
      await fetch(`http://localhost:3000/accept-friend-request/${userId}`, {
        method: "POST",
        credentials: "include",
      });

      const acceptedUser = requests.find((r) => r._id === userId);

      setRequests((prev) => prev.filter((r) => r._id !== userId));

      if (acceptedUser) {
        setFriends((prev) => [...prev, acceptedUser]);
      }
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  //  REJECT FRIEND REQUEST
  const rejectFriendRequest = async (userId) => {
    try {
      await fetch(`http://localhost:3000/reject-friend-request/${userId}`, {
        method: "POST",
        credentials: "include",
      });

      setRequests((prev) => prev.filter((r) => r._id !== userId));
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  //  REMOVE FRIEND
  const removeFriend = async (userId) => {
    try {
      await fetch(`http://localhost:3000/remove-friend/${userId}`, {
        method: "POST",
        credentials: "include",
      });

      // remove friend instantly from UI
      setFriends((prev) => prev.filter((f) => f._id !== userId));
    } catch (err) {
      console.error("Remove friend failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        Loading friends...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-8">
        <h1 className="text-2xl font-semibold">Friends</h1>

        {/* 🔍 Search */}
        <SearchUsers friends={friends} requests={requests} />

        {/* Friend Requests */}
        {requests.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Friend Requests</h2>

            {requests.map((req) => (
              <FriendRequestCard
                key={req._id}
                request={req}
                onAccept={acceptFriendRequest}
                onReject={rejectFriendRequest}
              />
            ))}
          </section>
        )}

        {/* Friends List */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Your Friends</h2>

          {friends.length === 0 ? (
            <p className="text-gray-400 text-sm">No friends yet</p>
          ) : (
            friends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                onRemove={removeFriend}
              />
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
