import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const ConversationDetails = ({ messages, isLoading, currentUserProfile }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return <div className="text-center py-4">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="text-center py-4">No messages in this conversation.</div>;
  }

  return (
    <div className="px-4 py-2 overflow-auto space-y-4">
      {messages.map((message) => {
        const isSentByCurrentUser = message.senderId === Meteor.userId();
        const avatarUrl = isSentByCurrentUser ? (currentUserProfile?.picture || '/images/defaultuserprofile.png') : (UserProfiles.findOne({ userID: message.senderId })?.picture || '/images/defaultuserprofile.png');
        const senderName = isSentByCurrentUser ? 'You' : (UserProfiles.findOne({ userID: message.senderId })?.firstName || 'Unknown');

        return (
          <div key={message._id} className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col items-center ${isSentByCurrentUser ? 'ml-4' : 'mr-4'}`}>
              <img src={avatarUrl} alt="Profile" className="w-10 h-10 rounded-full mb-1" />
              <p className="text-xs font-semibold">{senderName}</p>
            </div>
            <div className={`flex flex-col ${isSentByCurrentUser ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2 rounded-lg shadow ${isSentByCurrentUser ? 'bg-gradient-to-r from-green-400 to-green-200' : 'bg-gradient-to-r from-blue-400 to-blue-200'} text-white`}>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs pt-2">{new Date(message.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endOfMessagesRef} className="h-1" />
    </div>
  );
};

ConversationDetails.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
  userProfiles: PropTypes.array.isRequired,
  currentUserProfile: PropTypes.object,
};

export default withTracker((props) => {
  const { conversationId } = props;
  const messagesSubscription = Meteor.subscribe('messages.inConversation', conversationId);
  const profilesSubscription = Meteor.subscribe('UserProfilesPublication');
  const currentUserProfile = UserProfiles.findOne({ userId: Meteor.userId() }); // Fetch the current user's profile

  const isLoading = !messagesSubscription.ready() || !profilesSubscription.ready();
  const messages = Messages.find({ conversationId }, { sort: { createdAt: 1 } }).fetch();
  const userProfiles = UserProfiles.find({}).fetch();

  return {
    isLoading,
    messages,
    userProfiles,
    currentUserProfile, // Pass currentUserProfile to the component
  };
})(ConversationDetails);
