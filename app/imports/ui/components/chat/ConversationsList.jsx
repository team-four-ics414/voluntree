import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../../api/messaging/ConversationsCollection';
import { UserProfiles } from '../../../api/user/UserProfileCollection';
import { Messages } from '../../../api/messaging/MessagesCollection';
import { getTimeSince } from '../../utilities/GetTimeSince';

const ConversationsList = ({ conversations, isLoading, onSelectConversation, activeConversationId }) => {

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!conversations.length) {
    return <div className="text-center">No conversations available.</div>;
  }

  return (
    <div className="list-group overflow-auto" style={{ maxHeight: '80vh' }}>
      {conversations.map(({ _id, latestMessage, profile }) => (
        <button
          type="button"
          key={_id}
          className={`list-group-item list-group-item-action d-flex justify-content-start align-items-center ${activeConversationId === _id ? 'active' : ''}`}
          onClick={() => onSelectConversation(_id)}
        >
          <img
            src={profile?.picture || '/images/defaultUserProfile.png'}
            alt={`${profile?.firstName || 'User'}'s profile`}
            className="rounded-circle me-3"
            width="50"
            height="50"
          />
          <div>
            <h5 className="mb-1">{profile?.firstName || 'User'} {profile?.lastName || ''}</h5>
            <small className="text-muted">{latestMessage?.text || 'No messages yet'}</small><br />
            <small className="text-muted">{getTimeSince(latestMessage?.createdAt) ? getTimeSince(new Date(latestMessage.createdAt)).toLocaleString() : 'Unknown'}</small>
          </div>
        </button>
      ))}
    </div>
  );
};

ConversationsList.propTypes = {
  conversations: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  activeConversationId: PropTypes.string,
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
