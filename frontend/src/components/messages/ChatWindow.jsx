import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { messagesApi } from '../../api/messages';
import socketService from '../../utils/socket';

export default function ChatWindow({ conversation, currentUser, onRead }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (conversation) {
      setMessages([]);
      setPage(1);
      setHasMore(false);
      loadMessages(1);
      socketService.joinConversation(conversation._id);
      
      socketService.onReceiveMessage((message) => {
        setMessages(prev => [...prev, message]);
        if (message.sender !== currentUser._id) {
          socketService.markRead(conversation._id);
          messagesApi.markConversationRead(conversation._id).catch(() => {});
          if (onRead) onRead();
        }
      });

      socketService.onMessagesRead(({ conversationId }) => {
        if (conversationId === conversation._id) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.sender === currentUser._id && !msg.readAt
                ? { ...msg, readAt: new Date().toISOString() }
                : msg
            )
          );
        }
      });

      return () => {
        socketService.offReceiveMessage();
        socketService.offMessagesRead();
      };
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (nextPage) => {
    try {
      setLoading(true);
      const response = await messagesApi.getMessages(conversation._id, {
        page: nextPage,
        limit: 30,
      });
      const payload = response.data?.data || {};
      const incoming = payload.messages || [];

      setMessages((prev) =>
        nextPage === 1 ? incoming : [...incoming, ...prev]
      );
      setPage(nextPage);
      setHasMore(
        payload.meta &&
          payload.meta.page < payload.meta.totalPages
      );

      socketService.markRead(conversation._id);
      messagesApi.markConversationRead(conversation._id).catch(() => {});
      if (onRead) onRead();
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      conversationId: conversation._id,
      senderId: currentUser._id,
      content: newMessage.trim(),
    };

    socketService.sendMessage(messageData);
    setNewMessage('');
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-500">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {otherParticipant?.displayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-medium">{otherParticipant?.displayName || 'Unknown User'}</h3>
            <p className="text-sm text-gray-500">{conversation.listingTitle}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => loadMessages(page + 1)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Load earlier messages
                </button>
              </div>
            )}
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender === currentUser._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-black text-white rounded-full p-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
