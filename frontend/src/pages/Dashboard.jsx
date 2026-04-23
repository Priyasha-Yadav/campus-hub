import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/useAuthContext';
import { studyGroupsApi } from '../api/studyGroups';
import { messagesApi } from '../api/messages';
import { fetchMyListings } from '../api/listings';
import { dashboardApi } from '../api/dashboard';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import StatsOverview from '../components/dashboard/StatsOverview';
import QuickAccess from '../components/dashboard/QuickAccess';
import RecentActivity from '../components/dashboard/RecentActivity';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    studyGroups: [],
    conversations: [],
    stats: { listings: 0, studyGroups: 0, messages: 0 },
    summary: { activeListings: 0, activeGroups: 0, locations: 0 }
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [studyGroupsRes, conversationsRes, listingsRes, summaryRes] = await Promise.all([
        studyGroupsApi.getStudyGroups({ myGroups: 'true' }),
        messagesApi.getConversations(),
        fetchMyListings(),
        dashboardApi.getSummary()
      ]);

      const studyGroups = studyGroupsRes.data?.data?.groups || [];
      const conversations = conversationsRes.data?.data || [];

      const summary = summaryRes.data?.data || {
        activeListings: 0,
        activeGroups: 0,
        locations: 0
      };

      setDashboardData({
        studyGroups,
        conversations,
        stats: {
          listings: listingsRes.length,
          studyGroups: studyGroups.length,
          messages: conversations.length
        },
        summary
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-8 space-y-8">
      <WelcomeHero user={user} />
      <StatsOverview stats={dashboardData.stats} loading={loading} />
      <QuickAccess summary={dashboardData.summary} loading={loading} />
      <RecentActivity 
        studyGroups={dashboardData.studyGroups}
        conversations={dashboardData.conversations}
        loading={loading}
      />
    </main>
  );
}
