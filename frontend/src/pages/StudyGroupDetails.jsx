import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Tag, Link2, MapPin, Video, ArrowLeft, Trash2 } from 'lucide-react';
import { studyGroupsApi } from '../api/studyGroups';
import { useAuthContext } from '../context/AuthContext';

export default function StudyGroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadGroupDetails();
  }, [id]);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await studyGroupsApi.getStudyGroup(id);
      const groupData = response.data?.data;
      setGroup(groupData);
      
      // Check if user is in the group
      if (groupData?.members?.some(m => m._id === user._id)) {
        setIsJoined(true);
      }
    } catch (err) {
      console.error('Error loading group:', err);
      setError(err.response?.data?.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    try {
      setActionLoading(true);
      await studyGroupsApi.joinStudyGroup(id);
      setIsJoined(true);
      loadGroupDetails();
    } catch (err) {
      console.error('Error joining group:', err);
      setError(err.response?.data?.message || 'Failed to join group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    try {
      setActionLoading(true);
      await studyGroupsApi.leaveStudyGroup(id);
      setIsJoined(false);
      loadGroupDetails();
    } catch (err) {
      console.error('Error leaving group:', err);
      setError(err.response?.data?.message || 'Failed to leave group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
    
    try {
      setActionLoading(true);
      await studyGroupsApi.deleteStudyGroup(id);
      navigate('/study-groups');
    } catch (err) {
      console.error('Error deleting group:', err);
      setError(err.response?.data?.message || 'Failed to delete group');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const normalizeUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Group not found</p>
          <button
            onClick={() => navigate('/study-groups')}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Back to groups
          </button>
        </div>
      </div>
    );
  }

  const isCreator = user && group.creator?._id === user._id;
  const nextSession = group.nextSession;

  const linkItems = [
    group.links?.whatsapp && { label: 'WhatsApp', url: group.links.whatsapp },
    group.links?.telegram && { label: 'Telegram', url: group.links.telegram },
    group.links?.discord && { label: 'Discord', url: group.links.discord },
    group.links?.googleMeet && { label: 'Google Meet', url: group.links.googleMeet },
    ...(group.customLinks || []).map((link) => ({
      label: link.label || 'Link',
      url: link.url
    }))
  ].filter((item) => item && item.url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/study-groups')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          {isCreator && (
            <button
              onClick={handleDeleteGroup}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete Group
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Cover Image */}
        <div className="mb-8 rounded-xl overflow-hidden border-2 border-black shadow-[6px_6px_0_0_#000]">
          {group.image ? (
            <img
              src={group.image}
              alt={group.name}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-6xl font-bold text-gray-400">
                {group.subject[0]}
              </div>
            </div>
          )}
        </div>

        {/* Title and Subject */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-black px-3 py-1 text-xs text-white mb-3">
                {group.subject}
              </span>
              <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
              <p className="text-lg text-gray-600">{group.description}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Users size={16} />
              <span className="text-sm">Members</span>
            </div>
            <p className="text-3xl font-bold">{group.members.length}/{group.maxMembers}</p>
          </div>
          {nextSession?.at && (
            <div className="rounded-lg border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar size={16} />
                <span className="text-sm">Next Session</span>
              </div>
              <p className="text-sm font-semibold">{formatDate(nextSession.at)}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        {group.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-sm border">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Session Details */}
        {nextSession?.at && (
          <div className="mb-8 rounded-lg border-2 border-black p-6 bg-white shadow-[6px_6px_0_0_#000]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Next Meetup
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-semibold">{formatDate(nextSession.at)}</p>
              </div>
              {nextSession.mode && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mode</p>
                  <span className="inline-block rounded-full bg-black px-3 py-1 text-xs text-white capitalize">
                    {nextSession.mode}
                  </span>
                </div>
              )}
              {nextSession.location && (
                <div>
                  <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                    <MapPin size={14} />
                    Location
                  </p>
                  <p className="font-semibold">{nextSession.location}</p>
                </div>
              )}
              {nextSession.meetingLink && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <Video size={14} />
                    Meeting Link
                  </p>
                  <a
                    href={normalizeUrl(nextSession.meetingLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connections */}
        {isJoined && linkItems.length > 0 && (
          <div className="mb-8 rounded-lg border-2 border-black p-6 bg-white shadow-[6px_6px_0_0_#000]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Link2 size={20} />
              Connections
            </h3>
            <div className="flex flex-wrap gap-3">
              {linkItems.map((link, index) => (
                <a
                  key={`${link.label}-${index}`}
                  href={normalizeUrl(link.url)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-black px-4 py-2 font-semibold hover:shadow-[4px_4px_0_0_#000]"
                >
                  <Link2 size={16} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {!isJoined && linkItems.length > 0 && (
          <div className="mb-8 rounded-lg border-2 border-black p-4 bg-gray-50">
            <p className="text-sm text-gray-600">Join the group to see connection links and contact details.</p>
          </div>
        )}

        {/* Creator Info */}
        <div className="mb-8 rounded-lg border-2 border-black p-6 bg-white shadow-[6px_6px_0_0_#000]">
          <h3 className="text-lg font-semibold mb-4">Created by</h3>
          <div className="flex items-center gap-3">
            {group.creator?.avatar && (
              <img
                src={group.creator.avatar}
                alt={group.creator.name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">{group.creator?.name}</p>
              <p className="text-sm text-gray-600">{group.creator?.email}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
          <div className="max-w-4xl mx-auto px-4 flex gap-3">
            {isJoined ? (
              <button
                onClick={handleLeaveGroup}
                disabled={actionLoading}
                className="flex-1 rounded-lg border-2 border-black px-6 py-3 font-semibold hover:shadow-[4px_4px_0_0_#000] disabled:opacity-50"
              >
                {actionLoading ? 'Leaving...' : 'Leave Group'}
              </button>
            ) : (
              <button
                onClick={handleJoinGroup}
                disabled={actionLoading || group.members.length >= group.maxMembers}
                className="flex-1 rounded-lg bg-black px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {actionLoading ? 'Joining...' : group.members.length >= group.maxMembers ? 'Group Full' : 'Join Group'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
