import React, { useState } from 'react';
import ConversationsList from './ConversationsList';
import ConversationDetails from './ConversationsDetails';
import MessageForm from './MessageForm';
import UserSearch from './UserSearch'; // Import UserSearch component

const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);

  const handleUserSelected = (user) => {
    // Implement the logic to start a new conversation with this user or switch to an existing one
    console.log(user);
    // For demonstration, you might set the activeConversationId based on the selected user
  };

  return (
      <div className="flex flex-row h-screen">
        <div className="w-1/3 bg-gray-100 overflow-auto">
          <UserSearch onUserSelected={handleUserSelected} />
          <ConversationsList onSelectConversation={setActiveConversationId} activeConversationId={activeConversationId} />
        </div>
        <div className="w-2/3 bg-white overflow-auto">
          <ConversationDetails conversationId={activeConversationId} />
          <MessageForm conversationId={activeConversationId} />
        </div>
      </div>
  );
};

export default ChatInterface;
