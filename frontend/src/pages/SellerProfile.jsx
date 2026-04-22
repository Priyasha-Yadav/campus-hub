import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usersApi } from "../api/users";
import ListingCard from "../components/marketplace/ListingCard";

export default function SellerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await usersApi.getProfile(id);
        setProfile(res.data?.data || null);
      } catch (err) {
        console.error("Failed to load seller profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-8">Seller not found.</div>;
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.user.avatarUrl || "https://via.placeholder.com/80?text=User"}
            alt={profile.user.displayName}
            className="h-16 w-16 rounded-full object-cover border"
          />
          
          <div>
            <h1 className="text-2xl font-semibold">{profile.user.displayName}</h1>
            <p className="text-sm text-gray-500">
              Listings: {profile.stats.totalListings}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white md:p-10 w-full md:w-auto md:min-w-[280px]">
          <h2 className="text-sm font-semibold mb-2">Payment Info</h2>
          {profile.paymentInfo?.upiId && (
            <p className="text-xs text-gray-600">UPI ID: {profile.paymentInfo.upiId}</p>
          )}
          {profile.paymentInfo?.upiQrUrl && (
            <img
              src={profile.paymentInfo.upiQrUrl}
              alt="UPI QR"
              className="mt-3 h-40 w-40 md:h-48 md:w-48 rounded-lg border object-cover"
            />
          )}
          {!profile.paymentInfo?.upiId && !profile.paymentInfo?.upiQrUrl && (
            <p className="text-xs text-gray-500">No payment info shared.</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Listings</h2>
        {profile.listings.length === 0 ? (
          <p className="text-sm text-gray-500">No active listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.listings.map((listing) => (
              <ListingCard key={listing._id} item={listing} />
            ))}
          </div>
        )}
      </div>

  
    </div>
  );
}
