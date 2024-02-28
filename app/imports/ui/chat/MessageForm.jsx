import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

// Add conversationId prop to the component
const MessageForm = ({ conversationId }) => {
  const [text, setText] = useState('');

  // Since we're focusing on sending messages within a conversation,
  // there's no need to select a user from a list. The conversationId prop
  // determines the conversation context.

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId) return; // Ensure we have text and a conversationId

    Meteor.call('messages.add', { text, conversationId, receiverId: '<RECEIVER_ID>' }, (error) => {
      if (error) {
        console.error(`Failed to send message: ${error}`); // Log error to console for debugging
        alert(`Failed to send message: ${error.message}`);
      } else {
        alert('Message sent successfully!');
        setText(''); // Reset the message text only on successful send
      }
    });
  };

  // Removed the isLoading and users tracker since it's no longer needed for this use case

  return (
    <form onSubmit={sendMessage} className="flex flex-col space-y-4 p-4">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!conversationId} // Disable input if no conversation is selected
      />
      <button
        type="submit"
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={!text.trim() || !conversationId} // Disable button if no text or no conversationId
      >
        Send
      </button>
    </form>
  );
};

export default MessageForm;
