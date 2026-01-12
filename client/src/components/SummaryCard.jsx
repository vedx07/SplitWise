export default function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-[#0d1117] border border-[#242a33] rounded-lg p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
