import Sidebar from "../components/nav/SideNav";
import WelcomeHero from "../components/dashboard/WelcomeHero";
import StatsOverview from "../components/dashboard/StatsOverview";
import QuickAccess from "../components/dashboard/QuickAccess";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  return (

      <main className="flex-1 p-8 space-y-8">
        <WelcomeHero />
        <StatsOverview />
        <QuickAccess />
        <RecentActivity />
      </main>

  );
}
