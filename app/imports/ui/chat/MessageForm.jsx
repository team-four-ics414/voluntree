import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

// Ensure you're accepting receiverId as a prop here
const MessageForm = ({ conversationId, receiverId }) => {
  const [text, setText] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    // Make sure to use receiverId from the component's props
    if (!text.trim() || !conversationId || !receiverId) return; // Check for valid input

    Meteor.call('messages.add', { text, conversationId, receiverId }, (error) => {
      if (error) {
        console.error(`Failed to send message: ${error}`);
        alert(`Failed to send message: ${error.message}`);
      } else {
        alert('Message sent successfully!');
        setText(''); // Clear the input field after sending
      }
    });
  };

  return (
    <form onSubmit={sendMessage} className="flex flex-col space-y-4 p-4">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!conversationId} // Disable the input if no conversation is selected
      />
      <button
        type="submit"
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={!text.trim() || !conversationId || !receiverId} // Disable the button if necessary fields are missing
      >
        Send
      </button>
    </form>
  );
};

MessageForm.propTypes = {
  conversationId: PropTypes.string,
  receiverId: PropTypes.string,
};

export default MessageForm;
