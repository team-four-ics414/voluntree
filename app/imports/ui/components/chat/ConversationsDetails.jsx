import React, { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../../api/user/UserProfileCollection';

const ConversationDetails = ({ messages, isLoading, currentUserProfile }) => {
  const endOfMessagesRef = useRef(null);
  const messageRefs = useRef({}); // Added for referencing each message

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
    <div className="px-2 ">
      <div className="rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
        {messages.map((message) => {
          const isSentByCurrentUser = message.senderId === Meteor.userId();
          // Use currentUserProfile directly for the current user to ensure their avatar is displayed
          const avatarUrl = isSentByCurrentUser ? (currentUserProfile?.picture || '/images/defaultuserprofile.png') : (UserProfiles.findOne({ userID: message.senderId })?.picture || '/images/defaultuserprofile.png');
          const senderName = isSentByCurrentUser ? 'You' : (UserProfiles.findOne({ userID: message.senderId })?.firstName || 'Unknown');

          return (
            <div key={message._id} className={`mb-4 d-flex ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
              <img src={avatarUrl} alt="Avatar" className="rounded-circle shadow-sm w-10 h-10 ml-3" />
              <div
                className={`flex flex-col ${isSentByCurrentUser ? 'align-items-end' : 'align-items-start'} message-container`}
                ref={el => { messageRefs.current[message._id] = el; }}
              >
                <div className="rounded-lg p-4 shadow" style={{ backgroundColor: isSentByCurrentUser ? '#0d6efd' : '#f8f9fa', color: isSentByCurrentUser ? 'white' : 'black' }}>
                  <p className="font-bold">{senderName}</p>
                  <p className="message-content">{message.text}</p>
                  <p className="text-xs">{new Date(message.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>
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
  currentUserProfile: PropTypes.shape({
    picture: PropTypes.string,
    // Define other properties of currentUserProfile that you use
  }),
};

ConversationDetails.defaultProps = {
  currentUserProfile: null, // Set to null or an appropriate default object
};

export default withTracker((props) => {
  const { conversationId } = props;
  const messagesSubscription = Meteor.subscribe('messages.inConversation', conversationId);
  const profilesSubscription = Meteor.subscribe('UserProfilesPublication');

  const isLoading = !messagesSubscription.ready() || !profilesSubscription.ready();
  const messages = Messages.find({ conversationId }, { sort: { createdAt: 1 } }).fetch();
  const currentUserProfile = UserProfiles.findOne({ userId: Meteor.userId() });

  return {
    isLoading,
    messages,
    currentUserProfile,
  };
})(ConversationDetails);
