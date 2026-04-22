import { useEffect, useState } from "react";
import { fetchListings } from "../../api/listings";
import ListingCard from "./ListingCard";

export default function ListingsGrid({ filters }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);

      try {
        const response = await fetchListings({ ...filters, page, limit: 12 });

        if (Array.isArray(response.items)) {
          setListings(response.items);
          setMeta(response.meta);
        } else {
          console.error("Listings is not an array:", data);
          setListings([]);
          setMeta(null);
        }
      } catch (err) {
        console.error("Failed to fetch listings", err);
        setListings([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [filters, page]);

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

      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
            disabled={page >= meta.totalPages}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
