import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

const MessageForm = ({ conversationId, receiverId }) => {
  const [text, setText] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversationId || !receiverId) {
      console.log('Please fill in all fields before sending a message.');
      return;
    }

    Meteor.call('messages.add', { text, conversationId, receiverId }, (error) => {
      if (error) {
        console.error(`Failed to send message: ${error}`);
      } else {
        setText(''); // Clear the input field after sending
      }
    });
  };

  return (
    <form onSubmit={sendMessage} className="flex flex-col space-y-4 p-4">
      <input
        type="text"
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!conversationId || !receiverId} // Ensure both IDs are present before enabling input
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!text.trim() || !conversationId || !receiverId} // Ensure all conditions are met before enabling the button
      >
        Send
      </button>
    </form>
  );
};

MessageForm.propTypes = {
  conversationId: PropTypes.string, // Making these props optional
  receiverId: PropTypes.string, // Making these props optional
};

MessageForm.defaultProps = {
  conversationId: null,
  receiverId: null,
};

export default MessageForm;
