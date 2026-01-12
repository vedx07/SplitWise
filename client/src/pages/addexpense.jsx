import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

/* ===============================
   CONSTANTS
================================ */

const CATEGORIES = [
  { label: "Food", value: "food", emoji: "🍔" },
  { label: "Travel", value: "travel", emoji: "✈️" },
  { label: "Stay", value: "stay", emoji: "🏨" },
  { label: "Shopping", value: "shopping", emoji: "🛍️" },
  { label: "Party", value: "party", emoji: "🥂" },
  { label: "Settlement", value: "settlement", emoji: "💸" }, 
  { label: "Other", value: "other", emoji: "🛸" },
];


// API Call to get group members
const fetchMembers = async (groupId) => {
  if (!groupId) return [];

  try {
    const response = await fetch(
      `http://localhost:3000/group/${groupId}/members`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch members");
    }

    const data = await response.json();
    return data.members; // 👈 IMPORTANT
  } catch (err) {
    console.error("Server Error:", err.message);
    return [];
  }
};

    
// ======= API Call: Add Expense =======
// groupId is already inside payload
const AddExpensetoDB = async (payload) => {
  if (!payload) return null;

  try {
    const response = await fetch(
      "http://localhost:3000/expense/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // JWT via cookie
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add expense");
    }

    const data = await response.json(); 
    return data; 
  } catch (err) {
    console.error("Server Error:", err.message);
    return null;
  }
};

 

  // ======== Main ==========
export default function AddExpense() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      groupId : groupId, // Group Id 
      description: "",
      amount: "",
      category: "food",
      paidBy: "",
      splitAmong: [],
    },
  });

  const selectedMembers = watch("splitAmong") || [];

  useEffect(() => {
  const loadMembers = async () => {
    if (!groupId) return;

    try {
      setLoading(true);

      const data = await fetchMembers(groupId);

      setMembers(data);
      setValue(
        "splitAmong",
        data.map((m) => m._id)
      );
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  loadMembers();
}, [groupId, setValue]);


  const allSelected =
    members.length > 0 && selectedMembers.length === members.length;

  const toggleSelectAll = () => {
    setValue(
      "splitAmong",
      allSelected ? [] : members.map((m) => m._id)
    );
  };

  const selectedCategory = CATEGORIES.find(
    (c) => c.value === watch("category")
  );

  const onSubmit = async (data) => {
    await AddExpensetoDB({
      ...data,
      amount: Number(data.amount),  // string (from input) we should convert it into Number before storing it into DB
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-10 py-4 border-b border-[#30363d]">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>
      </div>

      {/* Form Wrapper */}
      <div className="flex-1 flex justify-center px-3 md:px-6 py-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-3xl
                     md:bg-[#0f141a]
                     md:border md:border-[#30363d]
                     md:rounded-xl
                     md:p-8
                     space-y-6"
        >
          <h1 className="text-lg md:text-2xl font-semibold text-center">
            Add Expense
          </h1>

          {/* Emoji */}
          <div className="flex justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#161b22]
                            flex items-center justify-center text-3xl md:text-4xl">
              {selectedCategory?.emoji}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400">Description</label>
              <input
                {...register("description", { required: true })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#161b22]
                           border border-[#30363d]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Amount (₹)</label>
              <input
                type="number"
                {...register("amount", { required: true })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#161b22]
                           border border-[#30363d]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Paid By</label>
              <select
                {...register("paidBy", { required: true })}
                className="w-full mt-1 px-3 py-2 rounded bg-[#161b22]
                           border border-[#30363d]"
              >
                <option value="">Select</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-400">Category</label>
              <select
                {...register("category")}
                className="w-full mt-1 px-3 py-2 rounded bg-[#161b22]
                           border border-[#30363d]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split */}
          <div>
            <h2 className="text-sm text-gray-300 mb-2">
              Split equally among
            </h2>

            {loading ? (
              <p className="text-gray-500 text-sm">Loading members…</p>
            ) : (
              <>
                {/* Select All */}
                <label className="flex items-center gap-3 px-4 py-3 mb-3 rounded
                                  bg-[#21262d] border border-[#30363d]
                                  cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <span className="font-medium">Select All</span>
                </label>

                {/* Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.map((m) => (
                    <label
                      key={m._id}
                      className="flex items-center gap-3 px-4 py-3 rounded
                                 bg-[#161b22] border border-[#30363d]
                                 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={m._id}
                        {...register("splitAmong")}
                      />
                      <span>{m.name}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Desktop Submit */}
          <div className="hidden md:flex justify-end">
            <button
              type="submit"
              className="px-10 py-2 bg-blue-600 hover:bg-blue-700
                         rounded font-medium"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Sticky Submit */}
      <div className="md:hidden sticky bottom-0 bg-[#0d1117] border-t border-[#30363d] p-4">
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700
                     rounded font-semibold"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}
