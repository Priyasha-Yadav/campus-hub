import { useEffect, useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Save, Trash2, LogOut } from 'lucide-react';
import { useAuthContext } from '../../context/useAuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { fetchMyListings } from '../../api/listings';
import { usersApi } from '../../api/users';
import ListingCard from '../marketplace/ListingCard';
import ConfirmModal from '../ui/ConfirmModal';
import { useToast } from '../ui/useToast';
import { updatePaymentInfo, uploadPaymentQr } from '../../api/settings';

export default function ProfileSettings({ settings, onSettingsUpdate }) {
  const { user, login, logout } = useAuthContext();
  const navigate = useNavigate();
  const { show } = useToast();
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || user?.avatar || null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    upiId: settings?.paymentInfo?.upiId || "",
    upiQrUrl: settings?.paymentInfo?.upiQrUrl || "",
  });
  const [savingPayment, setSavingPayment] = useState(false);
  const [qrFile, setQrFile] = useState(null);
  useEffect(() => {
    if (!settings) return;
    setFormData((prev) => ({ ...prev }));
    setPaymentInfo({
      upiId: settings?.paymentInfo?.upiId || "",
      upiQrUrl: settings?.paymentInfo?.upiQrUrl || "",
    });
    if (user?.avatarUrl || user?.avatar) {
      setAvatarUrl(user.avatarUrl || user.avatar);
    }
  }, [settings, user?.avatarUrl, user?.avatar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUser = { ...user, ...formData };
      login({ user: updatedUser, token: localStorage.getItem('token') });
      setSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    try {
      await usersApi.deleteMe();
      show("Account deleted", "success");
      logout();
      navigate("/auth");
    } catch (error) {
      console.error("Failed to delete account:", error);
      show("Failed to delete account", "error");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      show("File size must be less than 5MB", "error");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      show("Please upload an image file", "error");
      return;
    }

    try {
      setAvatarLoading(true);
      const response = await usersApi.uploadAvatar(file);

      const newAvatarUrl =
        response?.data?.data?.avatarUrl || response?.data?.avatarUrl;

      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);

        // Update user context
        const updatedUser = { ...user, avatarUrl: newAvatarUrl, avatar: newAvatarUrl };
        login({ user: updatedUser, token: localStorage.getItem('token') });
        show("Profile picture updated", "success");
      } else {
        show("Avatar uploaded but response was invalid", "error");
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      show("Failed to upload profile picture", "error");
    } finally {
      setAvatarLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePaymentSave = async (e) => {
    e.preventDefault();
    setSavingPayment(true);
    try {
      if (qrFile) {
        const uploadRes = await uploadPaymentQr(qrFile);
        if (uploadRes.success) {
          setPaymentInfo((prev) => ({
            ...prev,
            upiQrUrl: uploadRes.data.upiQrUrl,
          }));
          if (onSettingsUpdate) {
            onSettingsUpdate((prev) => ({
              ...prev,
              paymentInfo: {
                ...prev.paymentInfo,
                upiQrUrl: uploadRes.data.upiQrUrl,
              },
            }));
          }
        }
        setQrFile(null);
      }
      const response = await updatePaymentInfo(paymentInfo);
      if (response.success) {
        show("Payment info updated", "success");
        if (onSettingsUpdate) {
          onSettingsUpdate((prev) => ({
            ...prev,
            paymentInfo: response.data,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to update payment info:", error);
      show("Failed to update payment info", "error");
    } finally {
      setSavingPayment(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };
  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        setLoadingListings(true);
        const [myListingsRes, wishlistRes] = await Promise.all([
          fetchMyListings(),
          usersApi.getSavedListings()
        ]);

        setMyListings(Array.isArray(myListingsRes) ? myListingsRes : []);
        setWishlist(wishlistRes.data?.data || []);
      } catch (error) {
        console.error('Failed to load listings:', error);
      } finally {
        setLoadingListings(false);
      }
    };

    loadMarketplaceData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <User size={24} />
          <h2 className="text-xl font-semibold">Profile Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                formData.displayName[0]?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <button 
                type="button" 
                onClick={handleAvatarClick}
                disabled={avatarLoading}
                className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {avatarLoading ? 'Uploading...' : 'Change Photo'}
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="City, State"
                  className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about yourself..."
              rows="3"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut size={16} />
                Log out
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <form onSubmit={handlePaymentSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">UPI ID</label>
            <input
              type="text"
              value={paymentInfo.upiId}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              placeholder="yourname@upi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">UPI QR Code</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setQrFile(e.target.files?.[0] || null)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
            {paymentInfo.upiQrUrl && (
              <img
                src={paymentInfo.upiQrUrl}
                alt="UPI QR"
                className="mt-3 h-32 w-32 rounded-lg border object-cover"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPayment}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
            >
              {savingPayment ? "Saving..." : "Save Payment Info"}
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">My Listings</h3>
        {loadingListings ? (
          <div className="text-sm text-gray-500">Loading listings...</div>
        ) : myListings.length === 0 ? (
          <div className="text-sm text-gray-500">No active listings yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myListings.map((listing) => (
              <ListingCard key={listing._id} item={listing} />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Wishlist</h3>
        {loadingListings ? (
          <div className="text-sm text-gray-500">Loading wishlist...</div>
        ) : wishlist.length === 0 ? (
          <div className="text-sm text-gray-500">Your wishlist is empty.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {wishlist.map((listing) => (
              <ListingCard key={listing._id} item={listing} />
            ))}
          </div>
        )}
      </Card>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete account?"
        description="This will permanently delete your account and remove your listings."
        confirmText="Delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeleteAccount();
        }}
      />
    </div>
  );
}
