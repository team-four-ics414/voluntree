import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Messages } from '../../../api/messaging/MessagesCollection';

const MessageList = ({ messages, loading, currentUser }) => {
  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div>No messages found</div>;
  }

  return (
    <ul className="message-list" style={{ listStyleType: 'none', padding: 0 }}>
      {messages.map((message) => {
        const isSentByCurrentUser = message.senderId === currentUser._id;
        const messageAlignment = isSentByCurrentUser ? 'right' : 'left';
        const displayName = isSentByCurrentUser ? 'You' : message.senderName || 'Unknown';

        return (
          <li key={message._id} style={{ textAlign: messageAlignment, marginBottom: '10px' }}>
            <strong>{displayName}:</strong>
            <div>{message.text}</div>
            <div><small>Sent: {message.createdAt.toLocaleString()}</small></div>
          </li>
        );
      })}
    </ul>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    senderId: PropTypes.string.isRequired,
    senderName: PropTypes.string,
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('allMessages');
  const loading = !subscription.ready();
  const currentUser = Meteor.user(); // Getting the current user to identify sent and received messages
  const messages = Messages.find({}, { sort: { createdAt: -1 } }).fetch();

  // Optionally, enrich messages with sender names if not already included
  // This might require additional logic or a separate subscription

  return { messages, loading, currentUser };
})(MessageList);
