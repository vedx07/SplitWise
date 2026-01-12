export default function ExpenseRow({ expense }) {
  const perPersonShare =
    expense.splitAmong.length > 0
      ? expense.amount / expense.splitAmong.length
      : 0;

  return (
    <tr className="border-t border-[#242a33]">
      {/* Description */}
      <td className="px-4 py-5">
        {expense.description}
      </td>

      {/* Amount + per person */}
      <td className="px-4 py-3 text-right">
        <div className={`font-semibold ${
                          expense.category === "settlement"
                            ? "text-blue-500"
                            : "text-white"
                        }`}>
          ₹{expense.amount}
        </div>
        <div className="text-xs text-gray-400">
          ₹{perPersonShare.toFixed(2)} / person
        </div>
      </td>

      {/* Paid By */}
      <td className="px-4 py-3">
        {expense.paidBy?.name || "—"}
      </td>

      {/* Split Among */}
      <td className="px-4 py-3 text-gray-300">
        {expense.splitAmong.map((m) => m.name).join(", ")}
      </td>

      {/* Category */}
      <td className="px-4 py-3 capitalize">
        {expense.category}
      </td>
    </tr>
  );
}
