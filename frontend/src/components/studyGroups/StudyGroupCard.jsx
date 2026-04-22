import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Tag, Link2, MapPin, Video, Pencil, Trash2 } from 'lucide-react';

export default function StudyGroupCard({ group, onJoin, onLeave, currentUser, isJoined, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/study-groups/${group._id}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { 
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

  const nextSession = group.nextSession;
  const isCreator = currentUser && group.creator?._id === currentUser._id;
  const canViewConnections = isCreator || isJoined;

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] cursor-pointer transition-all" onClick={handleCardClick}>
      <div className="relative">
        {group.image ? (
          <img
            src={group.image}
            alt={group.name}
            className="h-32 w-full object-cover"
          />
        ) : (
          <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-400">
              {group.subject[0]}
            </div>
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-black px-3 py-1 text-xs text-white">
          {group.subject}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg">{group.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
          </div>
          <div className="rounded-full border px-3 py-1 text-xs text-gray-600">
            {group.members.length}/{group.maxMembers} members
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 mb-3">
          {nextSession?.at && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(nextSession.at)}</span>
            </div>
          )}
        </div>

        {group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {group.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {nextSession?.at && canViewConnections && (
          <div className="mb-3 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <Calendar size={14} />
                Next meetup: {formatDate(nextSession.at)}
              </div>
              {nextSession.mode && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-600 border">
                  {nextSession.mode}
                </span>
              )}
            </div>
            {nextSession.mode && (
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <Video size={12} />
                {nextSession.mode}
              </div>
            )}
            {nextSession.location && (
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} />
                {nextSession.location}
              </div>
            )}
            {nextSession.meetingLink && (
              <a
                href={normalizeUrl(nextSession.meetingLink)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-md bg-black px-2.5 py-1.5 text-xs text-white hover:opacity-90"
              >
                Join link
              </a>
            )}
          </div>
        )}

        {canViewConnections && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Connections
            </p>
            {linkItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {linkItems.slice(0, 4).map((link, index) => (
                  <a
                    key={`${link.label}-${index}`}
                    href={normalizeUrl(link.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Link2 size={12} />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No links added yet.</p>
            )}
          </div>
        )}

        {!canViewConnections && (
          <div className="mb-3 rounded-lg border border-dashed p-3 text-xs text-gray-500">
            Join the group to see connection links and meetup details.
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            by {group.creator?.displayName || 'Unknown'}
          </div>

          <div className="flex items-center gap-2">
            {isCreator && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </>
            )}

            {currentUser && !isCreator && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isJoined ? onLeave(group._id) : onJoin(group._id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isJoined 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-black text-white hover:opacity-90'
                }`}
              >
                {isJoined ? 'Leave' : 'Join'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
