import MarketplaceHeader from "../components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import ListingsGrid from "../components/marketplace/ListingsGrid";

export default function Marketplace() {
  return (
    <div className="flex-1 p-8 space-y-6">
      <MarketplaceHeader />
      <MarketplaceFilters />
      <ListingsGrid />
    </div>
  );
}
