import { Heart, MessageCircle, CheckCircle } from "lucide-react";
import { messagesApi } from "../../api/messages";
import { updateListingStatus, updateListing, deleteListing, uploadListingImages } from "../../api/listings";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usersApi } from "../../api/users";
import ListItemModal from "./ListItemModal";
import ConfirmModal from "../ui/ConfirmModal";
import { useToast } from "../ui/ToastProvider";

export default function ListingCard({ item }) {
  const { user, login } = useAuthContext();
  const navigate = useNavigate();
  const [status, setStatus] = useState(item.status || "available");
  const [isSaved, setIsSaved] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { show } = useToast();
  const isSeller = user && item.seller?._id === user._id;

  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      return;
    }
    const saved = (user.savedListings || []).map(String);
    setIsSaved(saved.includes(String(item._id)));
  }, [user, item._id]);

  const handleStartConversation = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (item.seller._id === user._id) {
      return; // Can't message yourself
    }

    try {
      const conversationData = {
        listingId: item._id,
        listingTitle: item.title,
        participantId: item.seller._id,
      };

      await messagesApi.createConversation(conversationData);
      navigate('/messages');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleMarkSold = async () => {
    try {
      const updated = await updateListingStatus(item._id, "sold");
      if (updated?.status) setStatus(updated.status);
    } catch (error) {
      console.error("Error updating listing status:", error);
    }
  };

  const handleToggleSaved = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    try {
      const response = await usersApi.toggleSavedListing(item._id);
      const saved = response.data?.data || [];
      const normalizedSaved = saved.map(String);
      setIsSaved(normalizedSaved.includes(String(item._id)));
      login({
        user: { ...user, savedListings: normalizedSaved },
        token: localStorage.getItem("token"),
      });
      show(isSaved ? "Removed from wishlist" : "Saved to wishlist", "success");
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      show("Wishlist update failed", "error");
    }
  };

  const handleEditListing = async ({ listingData, files }) => {
    const updated = await updateListing(item._id, listingData);
    if (files && files.length > 0) {
      try {
        await uploadListingImages(item._id, files);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    return updated;
  };

  const handleDeleteListing = async () => {
    try {
      await deleteListing(item._id);
      show("Listing deleted", "success");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting listing:", error);
      show("Failed to delete listing", "error");
    }
  };

  const formatPrice = (value) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-[6px_6px_0_0_#000]">
      <div className="relative">
        <img
          src={item.images?.[0] || "https://via.placeholder.com/600x400?text=Listing"}
          alt={item.title}
          className="h-56 w-full object-cover"
        />

        <button
          onClick={handleToggleSaved}
          className="absolute top-3 right-3 rounded-full bg-white p-2"
        >
          <Heart size={16} className={isSaved ? "fill-black text-black" : ""} />
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-black px-3 py-1 text-xs text-white">
          {item.condition}
        </span>

        <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs text-gray-700 border">
          {status}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{item.title}</h3>
          <p className="font-semibold">{formatPrice(item.price)}</p>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {item.category}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => item.seller?._id && navigate(`/sellers/${item.seller._id}`)}
            className="text-sm text-left hover:underline"
          >
            {item.seller?.displayName || "Unknown seller"}
          </button>

          {!isSeller && user && status === "available" && (
            <button 
              onClick={handleStartConversation}
              className="rounded-lg border p-2 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle size={16} />
            </button>
          )}

          {isSeller && status !== "sold" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
              <button
                onClick={handleMarkSold}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
              >
                <CheckCircle size={14} />
                Mark sold
              </button>
            </div>
          )}
        </div>
      </div>

      <ListItemModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleEditListing}
        initialData={item}
        submitLabel="Save Changes"
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Delete listing?"
        description="This will remove the listing from the marketplace."
        confirmText="Delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeleteListing();
        }}
      />
    </div>
  );
}
