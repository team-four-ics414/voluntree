import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ConversationsList from './ConversationsList';
import ChatApp from './ChatApp';

const MessagingDashboard = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <ConversationsList />
    <MessageList />
    <MessageForm />
    <h2>ChatApp</h2>
    <ChatApp />
  </div>
);

export default MessagingDashboard;
