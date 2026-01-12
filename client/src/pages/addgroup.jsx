import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { label: "Trip", value: "trip", emoji: "🏖️" },
  { label: "Travel", value: "travel", emoji: "✈️" },
  { label: "Food", value: "food", emoji: "🍔" },
  { label: "Festival", value: "fest", emoji: "🎉" },
  { label: "Roommates", value: "roommates", emoji: "🏠" },
  { label: "Office", value: "office", emoji: "💼" },
  { label: "Party", value: "party", emoji: "🥂" },
  { label: "Others", value: "other", emoji: "🛸" },
];

export default function AddGroup() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    document.title = "Add Group - SplitWise";

    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:3000/friends-list", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch friends");
        }

        setFriends(data.friends || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "trip",
      members: [],
    },
  });

  const selectedCategory = CATEGORIES.find(
    (c) => c.value === watch("category")
  );

  const addGroup = async (groupData) => {
    const response = await fetch("http://localhost:3000/add-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(groupData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add group");
    }

    return data; // 🔥 important
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        members: formData.members,
      };

      const createdGroup = await addGroup(payload);

      console.log("Created Group:", createdGroup);

      navigate("/groups");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 border-b border-[#30363d]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded
                     text-gray-400 hover:text-white hover:bg-[#161b22]
                     transition"
        >
          ← Back
        </button>
      </div>

      {/* Form Wrapper */}
      <div className="flex-1 flex justify-center items-start md:items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xl md:max-w-3xl
                     md:bg-[#0f141a]
                     md:border md:border-[#30363d]
                     md:rounded-xl
                     px-4 md:px-8 py-6 md:py-8
                     space-y-6"
        >
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-semibold text-center">
            Create New Group
          </h1>

          {/* Group Icon */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full bg-[#161b22]
                            flex items-center justify-center text-4xl"
            >
              {selectedCategory?.emoji}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Name */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-400">Group Name</label>
              <input
                {...register("name", { required: "Group name is required" })}
                placeholder="e.g. Goa Trip"
                className="w-full mt-1 px-4 py-2 rounded bg-[#161b22]
                           border border-[#30363d]
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-gray-400">Category</label>
              <select
                {...register("category")}
                className="w-full mt-1 px-4 py-2 rounded bg-[#161b22]
                           border border-[#30363d]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-400">
                Description (optional)
              </label>
              <textarea
                {...register("description")}
                rows={2}
                placeholder="What is this group for?"
                className="w-full mt-1 px-4 py-2 rounded bg-[#161b22]
                           border border-[#30363d] resize-none"
              />
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="text-sm text-gray-400">Add Members</label>

            {loadingFriends ? (
              <p className="text-sm text-gray-400 mt-2">Loading friends...</p>
            ) : friends.length === 0 ? (
              <p className="text-sm text-gray-400 mt-2">No friends available</p>
            ) : (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {friends.map((friend) => (
                  <label
                    key={friend._id}
                    className="flex items-center gap-3 px-4 py-2 rounded
                               bg-[#161b22] border border-[#30363d]
                               cursor-pointer hover:bg-[#21262d] transition"
                  >
                    <input
                      type="checkbox"
                      value={friend._id}
                      {...register("members", {
                        validate: (v) =>
                          v.length > 0 || "Select at least one member",
                      })}
                    />
                    <span>{friend.name}</span>
                  </label>
                ))}
              </div>
            )}

            {errors.members && (
              <p className="text-red-500 text-sm mt-1">
                {errors.members.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full md:w-auto md:px-10
                       bg-blue-600 hover:bg-blue-700
                       py-2 rounded font-medium transition"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
