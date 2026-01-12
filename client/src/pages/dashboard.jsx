import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

/* ===============================
   CHART COMPONENT IMPORTS
================================ */
import GroupExpenseBarChart from "../components/dashboard/GroupExpenseBarChart.jsx";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown.jsx";
import MonthlyExpenseLineChart from "../components/dashboard/MonthlyExpenseLineChart.jsx";

/* ===============================
   DASHBOARD
================================ */
const Dashboard = () => {
  const { userId , setAvatarUrl , setName } = useContext(UserContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  /* ===============================
     AUTH + USER FETCH
  ================================ */
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails(data);
        setAvatarUrl(data.avatarUrl);
        setName(data.name);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, navigate]);

  /* ===============================
     LOADING STATE
  ================================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-gray-300">
        <p className="text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  /* ===============================
     ERROR STATE
  ================================ */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  /* ===============================
     DASHBOARD UI
  ================================ */
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-gray-100">
      <Navbar />

      <main className="flex-1 px-6 py-10 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-xl text-gray-300 font-semibold">
            Hi, {userDetails?.name || "User"} 👋
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Dashboard Overview
          </h2>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyExpenseLineChart />
          <CategoryBreakdown />
          <div className="lg:col-span-2">
            <GroupExpenseBarChart />
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {NAV_CARDS.map(({ title, route }) => (
            <div
              key={title}
              onClick={() => navigate(route)}
              className="p-6 text-center bg-[#161b22] border border-[#30363d]
                         rounded-xl hover:bg-[#1f242c] transition cursor-pointer"
            >
              <p className="text-lg font-medium">{title}</p>
              <p className="text-sm text-gray-400 mt-2">
                View and manage your {title.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ===============================
   NAVIGATION CONFIG
================================ */
const NAV_CARDS = [
  { title: "Groups", route: "/groups" },
  { title: "Friends", route: "/friends" },
  { title: "Profile", route: "/profile" },
];

export default Dashboard;
