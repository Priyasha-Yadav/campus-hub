import { useState, useRef, useEffect } from 'react';
import { X, Upload, IndianRupee } from 'lucide-react';

export default function ListItemModal({ isOpen, onClose, onSubmit, initialData, submitLabel = "List Item" }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const categories = [
    'Textbooks',
    'Electronics', 
    'Furniture',
    'Clothing',
    'Sports',
    'Other'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price ?? '',
      category: initialData.category || '',
      condition: initialData.condition || 'good',
      images: initialData.images || []
    });
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const listingData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      await onSubmit({ listingData, files: selectedFiles });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'good',
        images: []
      });
      setSelectedFiles([]);
      
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create listing";
      setError(message);
      console.error("Error creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {initialData ? "Edit Listing" : "List an Item"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="What are you selling?"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {conditions.map(condition => (
                <label key={condition.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value={condition.value}
                    checked={formData.condition === condition.value}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="rounded"
                  />
                  <span className="text-sm">{condition.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your item..."
              rows="4"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Photos</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-black"
            >
              <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Click to upload photos</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
              {selectedFiles.length > 0 && (
                <p className="mt-2 text-xs text-gray-600">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setSelectedFiles(files);
              }}
            />
          </div>

          {/* Submit Buttons */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-black text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
