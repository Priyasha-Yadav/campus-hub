import { useState } from "react";
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

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "title_asc", label: "Title: A to Z" },
  { value: "title_desc", label: "Title: Z to A" },
];

export default function MarketplaceFilters({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "newest",
    minPrice: "",
    maxPrice: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            placeholder="Search for items..."
            className="w-full rounded-lg border px-10 py-2"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        <select
          className="rounded-lg border px-3 py-2"
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          className="rounded-lg border p-2"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              className="w-24 rounded border px-2 py-1"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            />
            <span className="self-center">-</span>
            <input
              type="number"
              placeholder="Max Price"
              className="w-24 rounded border px-2 py-1"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-1.5 text-sm border ${
              filters.category === cat
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => updateFilters({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
