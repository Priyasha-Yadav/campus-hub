import { Plus } from "lucide-react";

export default function MarketplaceHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-gray-500">
          Buy, sell & trade with fellow students
        </p>
      </div>

      <button className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white">
        <Plus size={18} />
        List an Item
      </button>
    </div>
  );
}
