import React, { useState } from 'react';
import ConversationsList from './ConversationsList';
import ConversationDetails from './ConversationsDetails'; // Ensure this is correctly named
import MessageForm from './MessageForm'; // Added for sending messages

const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);

  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/3 bg-gray-100 overflow-auto">
        <ConversationsList onSelectConversation={setActiveConversationId} activeConversationId={activeConversationId} />
      </div>
      <div className="w-2/3 bg-white overflow-auto">
        <ConversationDetails conversationId={activeConversationId} />
        <MessageForm conversationId={activeConversationId} /> {/* Now part of ChatInterface */}
      </div>
    </div>
  );
};

export default ChatInterface;
