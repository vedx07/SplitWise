import SummaryCard from "./SummaryCard";

export default function GroupSummary({ totalExpense, netBalance }) {
  let statusTitle = "Settled Up";
  let statusValue = "₹0";
  let statusColor = "text-gray-400";

  if (netBalance > 0) {
    statusTitle = "You Get";
    statusValue = `₹${netBalance}`;
    statusColor = "text-green-400";
  } else if (netBalance < 0) {
    statusTitle = "You Owe";
    statusValue = `₹${Math.abs(netBalance)}`;
    statusColor = "text-red-400";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryCard
        title="Total Expense"
        value={`₹${totalExpense}`}
        color="text-white"
      />

      <SummaryCard
        title={statusTitle}
        value={statusValue}
        color={statusColor}
      />
    </div>
  );
}
