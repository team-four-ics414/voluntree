import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const MessagingDashboard = () => (
  <div className="flex flex-col items-center justify-center p-4">
    <MessageList />
    <MessageForm />
  </div>
);

export default MessagingDashboard;
