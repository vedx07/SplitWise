import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/GroupCard";
import Loading from "./loading.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:3000/groups", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch groups");
        }

        // 👇 API returns { _id, groups: [...] }
        setGroups(data.groups || []);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />

      <main className="px-6 py-6 min-h-[calc(100vh-112px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Groups</h1>
            <p className="text-sm text-[#8b949e]">
              Manage your shared expenses
            </p>
          </div>

          <button
            onClick={() => navigate("/add-group")}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            + Add Group
          </button>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            {/* Icon */}
            <div className="mb-4 text-5xl animate-bounce">📭</div>

            {/* Title */}
            <p className="text-xl font-semibold text-white">No groups yet</p>

            {/* Subtitle */}
            <p className="text-sm text-[#8b949e] max-w-xs mt-1 mb-6">
              Create a group to start splitting expenses with friends.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/add-group")}
              className="
      bg-[#238636]
      hover:bg-[#2ea043]
      transition-all duration-200
      px-5 py-2.5
      rounded-md
      font-medium
      text-white
      shadow-lg shadow-[#238636]/30
      hover:scale-[1.03]
      active:scale-95
      focus:outline-none
      focus:ring-2
      focus:ring-[#2ea043]
    "
            >
              + Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onClick={() => navigate(`/group/${group._id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
