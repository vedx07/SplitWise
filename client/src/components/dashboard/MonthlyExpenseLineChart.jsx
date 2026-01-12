import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* ===============================
   PLACEHOLDER 
================================ */
function ChartPlaceholder({ text }) {
  return (
    <div className="h-[260px] flex items-center justify-center text-sm text-[#8b949e]">
      {text}
    </div>
  );
}

/* ===============================
   -------- MAIN COMPONENT ------
================================ */
export default function MonthlyExpenseLineChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMonthlyExpense = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:3000/expense/monthlyUserExpense",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch monthly expense");
        }

        const data = await response.json();
        setChartData(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load monthly expense data");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyExpense();
  }, []);

  const hasData = chartData.some((v) => v > 0);

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: "Monthly Expense (₹)",
        data: chartData,
        borderColor: "#58a6ff",
        backgroundColor: "rgba(88,166,255,0.15)",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#58a6ff",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          font: { size: 11 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#8b949e",
          callback: (v) => `₹${v}`,
        },
        grid: {
          color: "rgba(255,255,255,0.04)",
        },
      },
    },
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 overflow-hidden">
      <h2 className="text-white font-medium mb-1">
        Monthly Spending
      </h2>
      <p className="text-xs text-[#8b949e] mb-3">
        Your expenses month by month
      </p>

      <hr className="border-[#30363d] mb-3" />

      {loading && (
        <ChartPlaceholder text="Loading monthly expenses…" />
      )}

      {!loading && error && (
        <ChartPlaceholder text={error} />
      )}

      {!loading && !error && hasData && (
        <div className="relative h-[260px]">
          <Line data={data} options={options} />
        </div>
      )}

      {!loading && !error && !hasData && (
        <ChartPlaceholder text="No expenses recorded this year" />
      )}
    </div>
  );
}
