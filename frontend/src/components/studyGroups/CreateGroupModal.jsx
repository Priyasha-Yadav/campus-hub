import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CreateGroupModal({ isOpen, onClose, onSubmit, initialData, submitLabel = 'Create Group' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    tags: '',
    maxMembers: 10,
    nextSessionAt: '',
    nextSessionMode: 'online',
    nextSessionLocation: '',
    nextSessionMeetingLink: '',
    links: {
      whatsapp: '',
      telegram: '',
      discord: '',
      googleMeet: ''
    },
    customLinks: [
      { label: '', url: '' }
    ]
  });
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subjects = [
    'Computer Science',
    'Mathematics', 
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Other'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        subject: initialData.subject || '',
        tags: (initialData.tags || []).join(', '),
        maxMembers: initialData.maxMembers || 10,
        nextSessionAt: initialData.nextSession?.at
          ? new Date(initialData.nextSession.at).toISOString().slice(0, 16)
          : '',
        nextSessionMode: initialData.nextSession?.mode || 'online',
        nextSessionLocation: initialData.nextSession?.location || '',
        nextSessionMeetingLink: initialData.nextSession?.meetingLink || '',
        links: {
          whatsapp: initialData.links?.whatsapp || '',
          telegram: initialData.links?.telegram || '',
          discord: initialData.links?.discord || '',
          googleMeet: initialData.links?.googleMeet || ''
        },
        customLinks: initialData.customLinks?.length
          ? initialData.customLinks.map((link) => ({
              label: link.label || '',
              url: link.url || ''
            }))
          : [{ label: '', url: '' }]
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      links: {
        whatsapp: formData.links.whatsapp || undefined,
        telegram: formData.links.telegram || undefined,
        discord: formData.links.discord || undefined,
        googleMeet: formData.links.googleMeet || undefined
      },
      customLinks: formData.customLinks
        .map((link) => ({
          label: link.label?.trim(),
          url: link.url?.trim()
        }))
        .filter((link) => link.label || link.url),
      nextSession: formData.nextSessionAt
        ? {
            at: formData.nextSessionAt,
            mode: formData.nextSessionMode,
            location: formData.nextSessionLocation,
            meetingLink: formData.nextSessionMeetingLink
          }
        : undefined
    };
    Promise.resolve(onSubmit({ data, coverFile }))
      .then(() => {
        setFormData({
          name: '',
          description: '',
          subject: '',
          tags: '',
          maxMembers: 10,
          nextSessionAt: '',
          nextSessionMode: 'online',
          nextSessionLocation: '',
          nextSessionMeetingLink: '',
          links: {
            whatsapp: '',
            telegram: '',
            discord: '',
            googleMeet: ''
          },
          customLinks: [{ label: '', url: '' }]
        });
        setCoverFile(null);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message || "Failed to save study group";
        setError(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold px-6 pt-6">Create Study Group</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 overflow-y-auto max-h-[calc(85vh-72px)]">
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="algorithms, data structures, exam prep"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Max Members</label>
              <input
                type="number"
                min="2"
                max="50"
                value={formData.maxMembers}
                onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Next Session</label>
              <input
                type="datetime-local"
                value={formData.nextSessionAt}
                onChange={(e) => setFormData({...formData, nextSessionAt: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Session Mode</label>
              <select
                value={formData.nextSessionMode}
                onChange={(e) => setFormData({...formData, nextSessionMode: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.nextSessionLocation}
                onChange={(e) => setFormData({...formData, nextSessionLocation: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                placeholder="Room 204, Library"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meeting Link</label>
              <input
                type="url"
                value={formData.nextSessionMeetingLink}
                onChange={(e) => setFormData({...formData, nextSessionMeetingLink: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                placeholder="meet.google.com/..."
              />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Connection Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input
                  type="url"
                  value={formData.links.whatsapp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, whatsapp: e.target.value }
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telegram</label>
                <input
                  type="url"
                  value={formData.links.telegram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, telegram: e.target.value }
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="https://t.me/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discord</label>
                <input
                  type="url"
                  value={formData.links.discord}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, discord: e.target.value }
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="https://discord.gg/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Google Meet</label>
                <input
                  type="url"
                  value={formData.links.googleMeet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, googleMeet: e.target.value }
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Custom Links</h4>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      customLinks: [
                        ...formData.customLinks,
                        { label: '', url: '' }
                      ]
                    })
                  }
                  className="text-xs text-gray-600 hover:underline"
                >
                  + Add link
                </button>
              </div>
              <div className="space-y-2">
                {formData.customLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const next = [...formData.customLinks];
                        next[index] = { ...next[index], label: e.target.value };
                        setFormData({ ...formData, customLinks: next });
                      }}
                      className="md:col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      placeholder="Label"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const next = [...formData.customLinks];
                        next[index] = { ...next[index], url: e.target.value };
                        setFormData({ ...formData, customLinks: next });
                      }}
                      className="md:col-span-3 border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-black text-white rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Creating..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
