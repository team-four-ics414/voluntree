import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Messages } from '../../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../../api/user/UserProfileCollection';

const MessageList = ({ messages, loading }) => {
  useEffect(() => {}, [messages]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return <div className="alert alert-info" role="alert">No messages found</div>;
  }

  return (
    <ul className="list-group list-group-flush">
      {messages.map((message) => {
        const isSentByCurrentUser = message.senderId === Meteor.userId();
        const messageAlignment = isSentByCurrentUser ? 'text-end' : 'text-start';

        const recipient = UserProfiles.findOne({ userID: message.receiverId });
        const recipientName = recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown';

        const senderProfile = UserProfiles.findOne({ userID: message.senderId });
        // const senderName = senderProfile ? `${senderProfile.firstName} ${senderProfile.lastName}` : 'Unknown';
        const senderName = senderProfile ? 'You' : 'Unknown';

        return (
          <li key={message._id} className={`list-group-item ${messageAlignment}`}>
            <strong>
              {senderName} to {recipientName}:
            </strong>
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
    receiverId: PropTypes.string.isRequired,
  })).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('allMessages');
  const profilesSubscription = Meteor.subscribe('UserProfilesPublication');
  const loading = !subscription.ready() || !profilesSubscription.ready();
  const messages = Messages.find({}, { sort: { createdAt: -1 } }).fetch();

  return { messages, loading };
})(MessageList);
