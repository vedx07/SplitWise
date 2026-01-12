import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpenseRow from "./ExpenseRow";
import Button from "./Button";

/* ===============================
   API: Fetch Group Expenses
================================ */
const fetchGroupExpenses = async (groupId) => {
  if (!groupId) return [];

  try {
    const response = await fetch(
      `http://localhost:3000/expense/group/${groupId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();
    return data.expenses || [];
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    return [];
  }
};

/* ===============================
   COMPONENT
================================ */
export default function ExpenseTable() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Fetch Expenses
  ================================ */
  useEffect(() => {
    let mounted = true;

    const loadExpenses = async () => {
      try {
        const data = await fetchGroupExpenses(groupId);
        if (mounted) setExpenses(data);
      } catch (err) {
        console.error("Error loading expenses");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadExpenses();
    return () => {
      mounted = false;
    };
  }, [groupId]);

  return (
    <div className="bg-[#0d1117] border border-[#242a33] rounded-lg overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242a33]">
        <h2 className="text-white font-medium">Expenses</h2>

        <Button
          variant="primary"
          onClick={() => navigate(`/group/${groupId}/add-expense`)}
        >
          + Add Expense
        </Button>
      </div>

      {/* ================= STATES ================= */}
      {loading && (
        <p className="p-4 text-sm text-gray-400">Loading expenses...</p>
      )}

      {!loading && expenses.length === 0 && (
        <p className="p-4 text-sm text-gray-400">No expenses added yet.</p>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {!loading && expenses.length > 0 && (
        <>
          <div className="hidden md:block">
            <table className="w-full text-sm text-gray-300">
              <thead className="bg-[#0b0f14] text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Paid By</th>
                  <th className="text-left px-4 py-3 font-medium">
                    Split Among
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <ExpenseRow key={expense._id} expense={expense} />
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="md:hidden divide-y divide-[#242a33]">
            {expenses.map((e) => {
              const perPerson =
                e.splitAmong.length > 0
                  ? (e.amount / e.splitAmong.length).toFixed(2)
                  : 0;

              return (
                <div
                  key={e._id}
                  className="p-4 space-y-2 text-sm text-gray-300"
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{e.description}</p>
                      <p className="text-xs text-gray-400">
                        Paid by {e.paidBy?.name || "—"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          e.category === "settlement"
                            ? "text-blue-500"
                            : "text-white"
                        }`}
                      >
                        ₹{e.amount}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₹{perPerson} / person
                      </p>
                    </div>
                  </div>

                  {/* Split Among */}
                  <div className="text-xs text-gray-400">
                    {e.splitAmong.map((m) => m.name).join(", ")}
                  </div>

                  {/* Category */}
                  <div className="text-xs text-gray-500 capitalize">
                    {e.category}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
