import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend);

/* ===============================
   CATEGORY CONFIG
================================ */
const CATEGORY_CONFIG = {
  food: { label: "🍔 Food", color: "#3fb950" },
  travel: { label: "✈️ Travel", color: "#58a6ff" },
  stay: { label: "🏨 Stay", color: "#ff8f73" },
  shopping: { label: "🛍️ Shopping", color: "#a371f7" },
  party: { label: "🥂 Party", color: "#d29922" },
  other: { label: "🛸 Other", color: "#8b949e" },
};

/* ===============================
   DOUGHNUT CHART
================================ */
function CategoryDoughnut({ rawData }) {
  const labels = [];
  const values = [];
  const colors = [];

  Object.keys(CATEGORY_CONFIG).forEach((key) => {
    const amount = rawData[key] || 0;
    if (amount > 0) {
      labels.push(CATEGORY_CONFIG[key].label);
      values.push(amount);
      colors.push(CATEGORY_CONFIG[key].color);
    }
  });

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "#0d1117",
        borderWidth: 2,
        cutout: "68%",
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#8b949e",
          boxWidth: 10,
          padding: 12,
          font: { size: 12 },
        },
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
  };

  return (
    <div className="relative h-[260px]">
      <Doughnut data={data} options={options} />
    </div>
  );
}

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
   ----- MAIN COMPONENT ------
================================ */
export default function ExpenseCategoryChart() {
  const { groupId } = useParams();

  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3000/expense/ExpenseCategoryChart/${groupId}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category data");
        }

        const data = await response.json();
        setChartData(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load category data");
      } finally {
        setLoading(false);
      }
    };

    if (groupId) fetchCategoryData();
  }, [groupId]);

  const hasData =
    Object.values(chartData).some((v) => v > 0);

  return (
    <div className="bg-[#0d1117] border border-[#242a33] rounded-xl p-4 overflow-hidden">
      <h2 className="text-white font-medium mb-1">
        Category Breakdown
      </h2>
      <p className="text-xs text-[#8b949e] mb-3">
        Expense distribution by category
      </p>

      <hr className="border-[#242a33] mb-3" />

      {/* FIXED HEIGHT CONTENT */}
      {loading && (
        <ChartPlaceholder text="Loading category data…" />
      )}

      {!loading && error && (
        <ChartPlaceholder text={error} />
      )}

      {!loading && !error && hasData && (
        <CategoryDoughnut rawData={chartData} />
      )}

      {!loading && !error && !hasData && (
        <ChartPlaceholder text="No expenses recorded yet" />
      )}
    </div>
  );
}
