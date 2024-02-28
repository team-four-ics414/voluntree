import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ConversationsList from '../../chat/ConversationsList';

const MessagingDashboard = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <h2 className="mt-3 mb-4 text-center">Messaging Example</h2>

    <MessageList />
    <MessageForm />
  </div>
);

export default MessagingDashboard;
