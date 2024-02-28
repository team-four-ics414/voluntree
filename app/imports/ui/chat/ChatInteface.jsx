import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import ConversationsList from './ConversationsList';
import ConversationDetails from './ConversationsDetails';
import MessageForm from './MessageForm';
import UserSearch from './UserSearch'; // Import UserSearch component

const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);

  const handleUserSelected = (user) => {
    // Ensure you're correctly extracting the userId from the `user` parameter
    // Assuming `user` has an `_id` property which holds the userId
    const userId = user._id; // Correctly define `userId` by extracting it from `user`

    console.log('Calling initiate with userId:', userId);
    Meteor.call('conversations.initiate', userId, (error, result) => {
      if (error) {
        console.error('Error initiating conversation:', error);
      } else {
        console.log('Conversation initiated with ID:', result);
        setActiveConversationId(result); // Set the activeConversationId to the newly created conversation ID
      }
    });
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
