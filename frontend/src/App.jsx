import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import { ToastProvider } from "./components/ui/ToastProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Messages = lazy(() => import("./pages/Messages"));
const StudyGroups = lazy(() => import("./pages/StudyGroups"));
const StudyGroupDetails = lazy(() => import("./pages/StudyGroupDetails"));
const CampusMaps = lazy(() => import("./pages/CampusMaps"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Auth = lazy(() => import("./pages/Auth"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </ToastProvider>
  );
}
