import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";


export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />

      {/* Temporary redirect */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
