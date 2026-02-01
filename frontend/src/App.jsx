import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      {/* Protected app layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/study-groups" element={<div>Study Groups</div>} />
        <Route path="/messages" element={<div>Messages</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Route>
    </Routes>
  );
}
