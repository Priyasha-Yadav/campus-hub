import { useState } from 'react';
import { Plus } from "lucide-react";
import ListItemModal from './ListItemModal';
import { createListing, uploadListingImages } from '../../api/listings';

export default function MarketplaceHeader({ onListingCreated }) {
  const [showModal, setShowModal] = useState(false);

  const handleCreateListing = async ({ listingData, files }) => {
    try {
      const listing = await createListing(listingData);
      if (files && files.length > 0 && listing?._id) {
        try {
          await uploadListingImages(listing._id, files);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
        }
      }
      if (onListingCreated) {
        onListingCreated();
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Marketplace</h1>
          <p className="text-gray-500">
            Buy, sell & trade with fellow students
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
        >
          <Plus size={18} />
          List an Item
        </button>
      </div>

      <ListItemModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateListing}
      />
    </>
  );
}
