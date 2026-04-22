import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Messages from "./pages/Messages";
import StudyGroups from "./pages/StudyGroups";
import StudyGroupDetails from "./pages/StudyGroupDetails";
import CampusMaps from "./pages/CampusMaps";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SellerProfile from "./pages/SellerProfile";
import { ToastProvider } from "./components/ui/ToastProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected app layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/study-groups/:id" element={<StudyGroupDetails />} />
          <Route path="/campus-maps" element={<CampusMaps />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sellers/:id" element={<SellerProfile />} />
        </Route>
      </Route>
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}
