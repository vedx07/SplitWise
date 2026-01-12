import { Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import Loading from "../pages/loading.jsx";
export default function ProtectedRoute({ children }) {
  const { setUserId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUserId(data.userId);
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUserId]);

  if (loading) return <Loading />;

  return authorized ? children : <Navigate to="/" replace />;
}
