import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

/* ===============================
   BAR CHART
================================ */
function GroupBar({ rawData }) {
  const labels = rawData.map((g) => g.groupName);
  const values = rawData.map((g) => g.totalExpense);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Expense (₹)",
        data: values,
        backgroundColor: "#58a6ff",
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        right: 10,
        left: 0,
        bottom: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#161b22",
        titleColor: "#f0f6fc",
        bodyColor: "#c9d1d9",
        borderColor: "#30363d",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` ₹${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#8b949e",
          font: { size: 11, weight: "500" },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#8b949e",
          font: { size: 11 },
          callback: (v) => `₹${v}`,
        },
        grid: {
          color: "rgba(255,255,255,0.04)",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="relative h-[260px] overflow-hidden">
      <Bar data={data} options={options} />
    </div>
  );
}

/* ===============================
   ------ MAIN COMPONENT --------
================================ */
export default function GroupExpenseBarChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupExpenseData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:3000/expense/groupExpenseSummary",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch group expense data");
        }

        const data = await response.json();
        setChartData(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load group expense data");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupExpenseData();
  }, []);

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 overflow-hidden">
      <h2 className="text-white font-medium mb-1">
        Group-wise Expenses
      </h2>
      <p className="text-xs text-[#8b949e] mb-3">
        Total spending of group
      </p>

      <hr className="border-[#30363d] mb-3" />

      {loading && (
        <p className="text-sm text-[#8b949e]">
          Loading chart…
        </p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && chartData.length > 0 && (
        <GroupBar rawData={chartData} />
      )}

      {!loading && !error && chartData.length === 0 && (
        <p className="text-sm text-[#8b949e]">
          No group expenses found
        </p>
      )}
    </div>
  );
}
