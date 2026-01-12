import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Groups from "./pages/groups";
import Group from "./pages/group";
import AddGroup from "./pages/addgroup";
import AddExpense from "./pages/addexpense";
import Profile from "./pages/profile";
import Friends from "./pages/friends";
import NotFound from './pages/404';
import ProtectedRoute from './components/protectedRoutes';


function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>}/>
      <Route path="/add-group" element={<ProtectedRoute><AddGroup /></ProtectedRoute>}/>
      <Route path="/group/:groupId" element={<ProtectedRoute><Group /></ProtectedRoute>}/>
      <Route path="/group/:groupId/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
