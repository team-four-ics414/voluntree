import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../api/messaging/ConversationsCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Messages } from '../../api/messaging/MessagesCollection';

const ConversationsList = ({ conversations, isLoading, onSelectConversation, activeConversationId }) => {
  useEffect(() => {}, [conversations]); // Monitor changes in the conversations data

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!conversations.length) {
    return <div>No conversations available.</div>;
  }

  return (
    <ul>
      {conversations.map(({ _id, latestMessage, profile }) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <li
          key={_id}
          className={`p-4 flex items-center space-x-4 cursor-pointer ${
            activeConversationId === _id ? 'bg-blue-100' : ''
          }`}
          onClick={() => onSelectConversation(_id)}
        >
          <div className="flex flex-col items-center">
            <img
              src={profile?.picture || '/images/defaultUserProfile.png'}
              alt={`${profile?.firstName}'s profile`}
              className="w-10 h-10 rounded-full mb-1"
            />
            <p className="text-xs font-medium">
              {profile?.firstName} {profile?.lastName}
            </p>
          </div>
          <div className="flex-1">
            {/* Existing content remains the same */}
            <div className="text-sm text-gray-500">
              Latest Message: {latestMessage?.text}
            </div>
            <p className="text-xs text-gray-500">
              Sent: {latestMessage?.createdAt?.toLocaleString() || 'Unknown'}
            </p>
          </div>
        </li>
      ))}
    </ul>
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
  // eslint-disable-next-line react/require-default-props
  activeConversationId: PropTypes.string, // Not marking as isRequired
};

export default withTracker(() => {
  const conversationsHandle = Meteor.subscribe('conversations.list'); // Or 'conversationsWithParticipants' if it also publishes related profiles
  const profilesHandle = Meteor.subscribe('UserProfilesPublication'); // Ensure this subscription is available and correct
  console.log('Conversations handle ready:', conversationsHandle);
  const isLoading = !conversationsHandle.ready() || !profilesHandle.ready();

  const conversations = Conversations.find({}).fetch().map(conversation => {
    const latestMessage = Messages.findOne({ conversationId: conversation._id }, { sort: { createdAt: -1 } });
    const otherUserId = conversation.participants.find(id => id !== Meteor.userId());
    console.log('Conversation:', conversation); // Inspect the participants array
    console.log('Other User ID:', otherUserId);
    const profile = profilesHandle.ready() ? otherUserId && UserProfiles.findOne({ userID: otherUserId }) : null;
    console.log('Fetched Profile:', profile); // See what profile is being fetched

    if (!profile) {
      console.error(`Profile not found for user ${otherUserId} in conversation ${conversation._id}`);
      return { ...conversation, latestMessage, profile: null }; // Return profile as null if not found
    }

    return {
      ...conversation,
      latestMessage,
      profile: { ...profile },
    };
  });

  return {
    isLoading,
    conversations,
  };
})(ConversationsList);
