import { useNavigate } from "react-router-dom";

export default function QuickAccess({ summary, loading }) {
  const navigate = useNavigate();

  const items = [
    {
      title: "Marketplace",
      desc: "Buy, sell & trade items with students.",
      stat: `${loading ? "..." : summary.activeListings} active listings`,
      to: "/marketplace",
    },
    {
      title: "Study Groups",
      desc: "Find or create study groups.",
      stat: `${loading ? "..." : summary.activeGroups} active groups`,
      to: "/study-groups",
    },
    {
      title: "Campus Map",
      desc: "Navigate buildings and facilities.",
      stat: `${loading ? "..." : summary.locations} locations`,
      to: "/campus-maps",
    },
  ];
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Quick Access</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-white p-6 shadow-[6px_6px_0_0_#000] cursor-pointer hover:-translate-y-1 transition-transform"
            onClick={() => navigate(item.to)}
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            <p className="mt-4 font-semibold">{item.stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
