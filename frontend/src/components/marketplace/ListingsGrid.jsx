import { useEffect, useState } from "react";
import { fetchListings } from "../../api/listings";
import ListingCard from "./ListingCard";

export default function ListingsGrid({ filters }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);

      try {
        const data = await fetchListings(filters);

        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.error("Listings is not an array:", data);
          setListings([]);
        }
      } catch (err) {
        console.error("Failed to fetch listings", err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  if (loading) return <p>Loading listings...</p>;

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        Showing {listings.length} results
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <ListingCard key={item._id} item={item} />
        ))}
      </div>
    </>
  );
}
