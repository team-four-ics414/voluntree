import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const MessageForm = () => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  // Removed conversationId state since it's not directly used in this simplified form

  const sendMessage = (e) => {
    e.preventDefault();

    // Call a method to send a message, assuming it handles conversation logic
    Meteor.call('messages.sendByEmail', text, email, (error, conversationId) => {
      if (error) {
        alert(error.error);
      } else {
        setText('');
        setEmail('');
        // Optionally do something with conversationId, like redirecting to a conversation view
        console.log('Message sent in conversation:', conversationId);
      }
    });
  };

  return (
    <form onSubmit={sendMessage} className="flex flex-col space-y-4 p-4">
      <input
        type="email"
        placeholder="Recipient's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Send
      </button>
    </form>
  );
};

export default MessageForm;
