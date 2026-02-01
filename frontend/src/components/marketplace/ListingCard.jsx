import { Heart, MessageCircle } from "lucide-react";

export default function ListingCard({ item }) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-[6px_6px_0_0_#000]">
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-56 w-full object-cover"
        />

        <button className="absolute top-3 right-3 rounded-full bg-white p-2">
          <Heart size={16} />
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-black px-3 py-1 text-xs text-white">
          {item.condition}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{item.title}</h3>
          <p className="font-semibold">${item.price}</p>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {item.category}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">
            {item.seller?.displayName || "Unknown seller"}
          </div>

          <button className="rounded-lg border p-2">
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
