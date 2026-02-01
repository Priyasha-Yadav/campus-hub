import { Search, SlidersHorizontal, Grid, List } from "lucide-react";

const categories = [
  "All",
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports",
  "Other",
];

export default function MarketplaceFilters() {
  return (
    <div className="space-y-4">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            placeholder="Search for items..."
            className="w-full rounded-lg border px-10 py-2"
          />
        </div>

        <button className="rounded-lg border p-2">
          <SlidersHorizontal size={18} />
        </button>
        <button className="rounded-lg border p-2">
          <Grid size={18} />
        </button>
        <button className="rounded-lg border p-2">
          <List size={18} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-1.5 text-sm border ${
              i === 0
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
