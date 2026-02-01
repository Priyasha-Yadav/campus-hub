const items = [
  {
    title: "Marketplace",
    desc: "Buy, sell & trade items with students.",
    stat: "156 active listings",
  },
  {
    title: "Study Groups",
    desc: "Find or create study groups.",
    stat: "42 active groups",
  },
  {
    title: "Campus Map",
    desc: "Navigate buildings and facilities.",
    stat: "85 locations",
  },
];

export default function QuickAccess() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Quick Access</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-white p-6 shadow-[6px_6px_0_0_#000]"
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
