export default function StatsOverview({ stats, loading }) {
  const statItems = [
    { label: "My Listings", value: stats.listings },
    { label: "Study Groups", value: stats.studyGroups },
    { label: "Conversations", value: stats.messages },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="relative rounded-xl border bg-white p-6 shadow-[6px_6px_0_0_#000]"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-3xl font-semibold mt-1">
            {loading ? '...' : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
