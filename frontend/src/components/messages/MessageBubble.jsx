export default function MessageBubble({ message, isOwn }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-black text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-gray-300' : 'text-gray-500'}`}>
          {formatTime(message.createdAt)}
          {isOwn && (
            <span className="ml-2">
              {message.readAt ? 'Read' : 'Sent'}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
