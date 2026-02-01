import { Outlet } from "react-router-dom";
import SideNav from "../components/nav/SideNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <SideNav />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
