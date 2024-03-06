import React, { useState, useEffect } from 'react'; // Import useEffect here
import { Meteor } from 'meteor/meteor';
import ConversationsList from './ConversationsList';
import ConversationDetails from './ConversationsDetails';
import MessageForm from './MessageForm';
import UserSearch from './UserSearch';
// Import Conversations collection
import { Conversations } from '../../api/messaging/ConversationsCollection'; // Adjust the path as necessary

const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  const handleUserSelected = (user) => {
    const userId = user._id;
    console.log('Calling initiate with userId:', userId);
    Meteor.call('conversations.initiate', userId, (error, result) => {
      if (error) {
        console.error('Error initiating conversation:', error);
      } else {
        console.log('Conversation initiated with ID:', result);
        setActiveConversationId(result);
      }
    });
  };

  useEffect(() => {
    if (activeConversationId) {
      // Directly find the conversation and set the receiverId without redeclaring it
      const activeConversation = Conversations.findOne({ _id: activeConversationId });
      if (activeConversation) {
        // Directly find the receiverId without redeclaring it
        const newReceiverId = activeConversation.participants.find(participantId => participantId !== Meteor.userId());
        setReceiverId(newReceiverId); // Update state without redeclaring the variable
      }
    }
  }, [activeConversationId]);

  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/3 bg-gray-100 overflow-auto">
        <UserSearch onUserSelected={handleUserSelected} />
        <ConversationsList onSelectConversation={setActiveConversationId} activeConversationId={activeConversationId} />
      </div>
      <div className="w-2/3 bg-white overflow-auto">
        <ConversationDetails conversationId={activeConversationId} />
        <MessageForm conversationId={activeConversationId} receiverId={receiverId} />
      </div>
    </div>
  );
};

export default ChatInterface;
