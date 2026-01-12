import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* ===============================
   API: Fetch Settlement Summary
================================ */
const fetchSettlementSummary = async (groupId) => {
  if (!groupId) return [];

  try {
    const res = await fetch(
      `http://localhost:3000/group/${groupId}/settlement`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch settlement summary");

    const data = await res.json();
    return data.settlements || [];
  } catch (err) {
    console.error("Settlement fetch error:", err.message);
    return [];
  }
};

/* ===============================
   ---- Main ----
================================ */
export default function GroupSettlement() {
  const { groupId } = useParams();

  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettlement = async () => {
      setLoading(true);
      const data = await fetchSettlementSummary(groupId);
      setSettlements(data);
      setLoading(false);
    };

    loadSettlement();
  }, [groupId]);

  return (
    <div className="bg-[#0d1117] border border-[#242a33] rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Settlement Summary
        </h2>

        {!loading && settlements.length > 0 && (
          <span className="text-xs text-gray-400">
            {settlements.length} pending
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-gray-400">
          Calculating settlement...
        </p>
      )}

      {/* All Settled */}
      {!loading && settlements.length === 0 && (
        <div className="text-sm text-green-400 flex items-center gap-2">
          🎉 Everyone is settled
        </div>
      )}

      {/* Settlement List */}
      {!loading && settlements.length > 0 && (
        <ul className="space-y-3">
          {settlements.map((s, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-[#0b0f14] border border-[#1f242d] rounded-lg px-4 py-3"
            >
              <div className="text-sm text-gray-300">
                <span className="text-white font-medium">
                  {s.from?.name}
                </span>{" "}
                <span className="text-gray-400">owes</span>{" "}
                <span className="text-white font-medium">
                  {s.to?.name}
                </span>
              </div>

              <div className="text-sm font-semibold text-red-400">
                ₹{s.amount}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
