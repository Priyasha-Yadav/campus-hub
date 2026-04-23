import { useState, useEffect } from 'react';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import { messagesApi } from '../api/messages';
import { useAuthContext } from '../context/useAuthContext';
import socketService from '../utils/socket';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    loadConversations();
    socketService.connect();
    socketService.onReceiveMessage(() => {
      loadConversations();
    });
    socketService.onMessagesRead(() => {
      loadConversations();
    });

    return () => {
      socketService.offReceiveMessage();
      socketService.offMessagesRead();
      socketService.disconnect();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const response = await messagesApi.getConversations();
      setConversations(response.data?.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const refreshConversations = () => {
    loadConversations();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        currentUser={user}
      />
      <ChatWindow
        conversation={selectedConversation}
        currentUser={user}
        onRead={refreshConversations}
      />
    </div>
  );
}
