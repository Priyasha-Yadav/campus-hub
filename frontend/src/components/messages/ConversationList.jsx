import { MessageCircle } from 'lucide-react';

export default function ConversationList({ conversations, selectedConversation, onSelectConversation, currentUser }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (participants) => {
    return participants.find(p => p._id !== currentUser._id);
  };

  return (
    <div className="w-80 border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle size={24} />
          Messages
        </h2>
      </div>
      
      <div className="overflow-y-auto h-full">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation.participants);
            const isSelected = selectedConversation?._id === conversation._id;
            
            return (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  isSelected ? 'bg-gray-100 border-l-4 border-l-black' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {otherParticipant?.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">
                      {otherParticipant?.displayName || 'Unknown User'}
                    </h3>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.listingTitle}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-black px-2 py-0.5 text-xs text-white">
                      {conversation.unreadCount} unread
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
