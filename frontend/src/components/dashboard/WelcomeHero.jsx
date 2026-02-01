import useAuth from "../../hooks/useAuth";
import { ShoppingBag } from "lucide-react";

export default function WelcomeHero() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-black via-neutral-800 to-neutral-400 text-white p-8">
      <h1 className="text-3xl font-semibold">
        Welcome back, {user?.displayName} 👋
      </h1>

      <p className="mt-2 text-gray-300 max-w-xl">
        Stay connected with your campus community. Explore the marketplace,
        join study groups, and navigate campus with ease.
      </p>

      <div className="mt-6 flex gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-black font-medium">
          <ShoppingBag size={18} />
          Browse Marketplace
        </button>

        <button className="rounded-lg border border-white/30 px-4 py-2 text-white">
          Explore Groups
        </button>
      </div>
    </div>
  );
}
