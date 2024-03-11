import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../api/messaging/ConversationsCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Messages } from '../../api/messaging/MessagesCollection';

const ConversationsList = ({ conversations, isLoading, onSelectConversation, activeConversationId }) => {
  useEffect(() => {}, [conversations]); // This empty useEffect can be removed if not used

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!conversations.length) {
    return <div className="text-white">No conversations available.</div>;
  }

  return (
    <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl border border-white/5 p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
      <ul>
        {conversations.map(({ _id, latestMessage, profile }) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
          <li
            key={_id}
            className={`p-4 flex items-center space-x-4 cursor-pointer ${
              activeConversationId === _id ? 'bg-blue-100' : 'bg-white/20'
            }`}
            onClick={() => onSelectConversation(_id)}
          >
            <div className="flex flex-col items-center">
              <img
                src={profile?.picture || '/images/defaultUserProfile.png'}
                alt={`${profile?.firstName || 'User'}'s profile`}
                className="w-10 h-10 rounded-full mb-1"
              />
              <p className="text-xs font-medium text-white">
                {profile?.firstName || 'User'} {profile?.lastName || ''}
              </p>
            </div>
            <div className="flex-1">
              <div className="text-sm text-white">
                Latest Message: {latestMessage?.text || 'No messages yet'}
              </div>
              <p className="text-xs text-white">
                Sent: {latestMessage?.createdAt ? latestMessage.createdAt.toLocaleString() : 'Unknown'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ConversationsList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    latestMessage: PropTypes.shape({
      text: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
    }),
    profile: PropTypes.shape({
      picture: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  activeConversationId: PropTypes.string,
};

ConversationsList.defaultProps = {
  activeConversationId: null,
};

export default withTracker(() => {
  const conversationsHandle = Meteor.subscribe('conversations.list');
  const profilesHandle = Meteor.subscribe('UserProfilesPublication');

  const isLoading = !conversationsHandle.ready() || !profilesHandle.ready();

  const conversations = Conversations.find({}, { sort: { updatedAt: -1 } }).fetch().map(conversation => {
    const latestMessage = Messages.findOne({ conversationId: conversation._id }, { sort: { createdAt: -1 } });
    const otherUserId = conversation.participants.find(id => id !== Meteor.userId());
    const profile = profilesHandle.ready() ? UserProfiles.findOne({ userID: otherUserId }) : null;

    return {
      ...conversation,
      latestMessage,
      profile,
    };
  });

  return {
    isLoading,
    conversations,
  };
})(ConversationsList);
