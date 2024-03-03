import React, { useEffect, useRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const ConversationDetails = ({ messages, isLoading, currentUserProfile }) => {
  const endOfMessagesRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return <div className="text-center py-4 text-white">Loading messages...</div>;
  }

  if (messages.length === 0) {
    return <div className="text-center py-4 text-white">No messages in this conversation.</div>;
  }

  return (
      <div className="w-full md:w-6/12 lg:w-7/12 xl:w-7/12 px-2">
        <div className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
          {messages.map((message) => {
            const isSentByCurrentUser = message.senderId === Meteor.userId();
            const avatarUrl = isSentByCurrentUser ? (currentUserProfile?.picture || '/images/defaultuserprofile.png') : (UserProfiles.findOne({ userID: message.senderId })?.picture || '/images/defaultuserprofile.png');
            const senderName = isSentByCurrentUser ? 'You' : (UserProfiles.findOne({ userID: message.senderId })?.firstName || 'Unknown');

            return (
                <div key={message._id} className={`mb-4 flex ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                  <img src={avatarUrl} alt={senderName} className="rounded-full shadow-lg w-10 h-10" />
                  <div className="flex flex-col justify-center bg-white/20 backdrop-blur-md rounded-lg p-4 shadow">
                    <div className="flex justify-between items-center mb-1 w-full">
                      <p className="font-bold text-white">{senderName}</p>
                      <p className="text-xs text-white">{new Date(message.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-white break-words">{message.text}</p>
                  </div>
                </div>
            );
          })}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="mt-4">
        <textarea
            className="form-control w-full rounded-lg bg-white/20 p-2 text-white placeholder-white"
            rows="4"
            placeholder="Message"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
        />
          <button
              type="button"
              className="btn btn-light btn-lg btn-rounded float-right mt-2 text-gray-700"
              onClick={() => { /* Handle sending message */ }}
          >
            Send
          </button>
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
  currentUserProfile: PropTypes.object,
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
