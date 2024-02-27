import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const MessageForm = () => {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();

    Meteor.call('messages.sendByEmail', text, email, (error) => {
      if (error) {
        alert(error.error);
      } else {
        setText('');
        setEmail('');
      }
      console.log('text', text, 'email', email);
    });
  };

  return (
    <form onSubmit={sendMessage}>
      <input
        type="email"
        placeholder="Recipient's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
