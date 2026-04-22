import { Users, MessageCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function RecentActivity({ studyGroups, conversations, loading }) {
  const navigate = useNavigate();
  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const activities = [];
  
  // Add study group activities
  studyGroups.slice(0, 2).forEach(group => {
    activities.push({
      id: `group-${group._id}`,
      icon: Users,
      title: `Joined study group: ${group.name}`,
      time: formatTime(group.createdAt),
      type: 'study-group'
    });
  });
  
  // Add conversation activities
  conversations.slice(0, 2).forEach(conv => {
    activities.push({
      id: `conv-${conv._id}`,
      icon: MessageCircle,
      title: `New conversation about: ${conv.listingTitle}`,
      time: formatTime(conv.lastMessageAt || conv.createdAt),
      type: 'message'
    });
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={() => navigate("/notifications")}
        >
          View all →
        </button>
      </div>

      <div className="rounded-xl border bg-white divide-y">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No recent activity
          </div>
        ) : (
          activities.slice(0, 4).map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="p-4 flex items-center gap-3">
                <IconComponent size={16} className="text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
