import { ShoppingBag, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WelcomeHero({ user }) {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-black via-neutral-800 to-neutral-400 text-white p-8">
      <h1 className="text-3xl font-semibold">
        {getGreeting()}, {user?.displayName || 'Student'} 👋
      </h1>

      <p className="mt-2 text-gray-300 max-w-xl">
        Stay connected with your campus community. Explore the marketplace,
        join study groups, and navigate campus with ease.
      </p>

      <div className="mt-6 flex gap-3">
        <button 
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-black font-medium hover:opacity-90"
        >
          <ShoppingBag size={18} />
          Browse Marketplace
        </button>

        <button 
          onClick={() => navigate('/study-groups')}
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-white hover:bg-white/10"
        >
          <Users size={18} />
          Explore Groups
        </button>
      </div>
    </div>
  );
}
