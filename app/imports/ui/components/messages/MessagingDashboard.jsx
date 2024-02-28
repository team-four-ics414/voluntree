import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ConversationsList from './ConversationsList';

const MessagingDashboard = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <ConversationsList />
    <MessageList />
    <MessageForm />
  </div>
);

export default MessagingDashboard;
