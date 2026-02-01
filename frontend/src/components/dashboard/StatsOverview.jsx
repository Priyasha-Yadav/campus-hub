const stats = [
  { label: "Active Listings", value: 24 },
  { label: "Study Groups", value: 8 },
  { label: "Campus Events", value: 12 },
];

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative rounded-xl border bg-white p-6 shadow-[6px_6px_0_0_#000]"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-3xl font-semibold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
