import GroupHeader from "../components/GroupHeader";
import GroupSummary from "../components/GroupSummary";
import ExpenseTable from "../components/ExpenseTable";
import GroupSettlement from "../components/GroupSettlement";
import ExpenseCategoryChart from "../components/ExpenseCategoryChart";
import Navbar from "../components/Navbar";
import Loading from './loading'
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


/* ===============================
   API: Fetch Group Members
================================ */
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
    return data.members; // must be array
  } catch (err) {
    console.error("Server Error:", err.message);
    return [];
  }
};
/* ===============================
   API: Fetch Group Details
================================ */
const fetchGroupDetails = async (groupId) => {
  if (!groupId) return [];

  try {
    const response = await fetch(
      `http://localhost:3000/group/${groupId}/details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch group details");
    }

    const data = await response.json();
    return data; // must be array
  } catch (err) {
    console.error("Server Error:", err.message);
    return [];
  }
};
/* ===============================
   API: Fetch Net Balance
================================ */
const fetchNetBalance = async (groupId) => {
  if (!groupId) return 0;

  try {
    const response = await fetch(
      `http://localhost:3000/group/${groupId}/net-balance`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch net balance");
    }

    const data = await response.json();
    return data.netBalance ?? 0;
  } catch (err) {
    console.error("Net balance fetch error:", err.message);
    return 0;
  }
};
/* ===============================
  --------- GroupPage --------
================================ */

export default function GroupPage() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setNetBalance] = useState(0);

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        const groupData = await fetchGroupDetails(groupId);
        setGroup(groupData);

        const membersData = await fetchMembers(groupId);
        setMembers(membersData);

        const balance = await fetchNetBalance(groupId);
        setNetBalance(balance);
      } catch (err) {
        console.error("Error loading group");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  if (loading || !group) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <GroupHeader
          name={group.name}
          category={group.category}
          description={group.description}
          members={members}
          createdAt={group.createdAt}
        />

        {/* Summary */}
        <GroupSummary
          totalExpense={group.totalExpense}
          netBalance={balance}
        />

        {/* =====================
           TABLE + CHART 
        ====================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense Table */}
          <div className="lg:col-span-2">
            <ExpenseTable />
          </div>

          {/* Category Chart */}
          <div>
            <ExpenseCategoryChart />
          </div>
        </div>

        {/* =====================
           SETTLEMENT
        ====================== */}
        <div className="w-full">
          <GroupSettlement />
        </div>
      </main>

      <Footer />
    </div>
  );
}
