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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (messages.length === 0) {
    return <div className="text-center p-4 mx-auto text-gray-500">No messages found</div>;
  }

  return (
    <ul className="divide-y divide-gray-300 overflow-auto max-h-96">
      {messages.map((message) => {
        const isSentByCurrentUser = message.senderId === Meteor.userId();
        const senderProfile = UserProfiles.findOne({ userID: message.senderId });
        const senderName = senderProfile ? `${senderProfile.firstName} ${senderProfile.lastName}` : 'Unknown';
        const avatarUrl = senderProfile && senderProfile.picture ? senderProfile.picture : '/images/defaultuserprofile.png';

        return (
          <li key={message._id} className={`flex items-start space-x-2 px-4 py-2 ${isSentByCurrentUser ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <img src={avatarUrl} alt={`${senderName}'s `} className="w-10 h-10 rounded-full mb-1" />

              {/* Sender Name */}
              <p className="text-xs font-medium">{isSentByCurrentUser ? 'You' : senderName}</p>
            </div>

            {/* Message Content */}
            <div className="flex-1">
              <p className="text-sm text-gray-800">{message.text}</p>
              <p className="text-xs text-gray-500">Sent: {message.createdAt.toLocaleString()}</p>
            </div>
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
