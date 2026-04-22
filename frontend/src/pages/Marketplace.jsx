import { useState } from 'react';
import MarketplaceHeader from "../components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters";
import ListingsGrid from "../components/marketplace/ListingsGrid";

export default function Marketplace() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState({});

  const handleListingCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      <MarketplaceHeader onListingCreated={handleListingCreated} />
      <MarketplaceFilters onFiltersChange={handleFiltersChange} />
      <ListingsGrid key={refreshTrigger} filters={filters} />
    </div>
  );
}
