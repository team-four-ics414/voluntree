import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../../api/messaging/ConversationsCollection';
import { Messages } from '../../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../../api/user/UserProfileCollection';

const ConversationsList = ({ conversations, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!conversations.length) {
    return <div>No conversations found.</div>;
  }

  return (
    <ul>
      {conversations.map(({ _id, latestMessage, profile }) => (
        <li key={_id} onClick={() => { /* navigate to conversation view */ }}>
          <img
            src={profile?.picture || '/images/defaultUserProfile.png'}
            alt={`${profile?.firstName || 'Unknown User'}'s profile`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">{profile?.firstName || 'Unknown User'} {profile?.lastName || ''}</div>
            <div>{latestMessage?.text}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default withTracker(() => {
  // Subscribe to necessary publications
  const subscriptions = [
    Meteor.subscribe('conversations.latestMessages'),
    Meteor.subscribe('CurrentUserProfile'),
    Meteor.subscribe('UserProfilesPublication'),
  ];

  const isLoading = subscriptions.some(sub => !sub.ready());

  // Fetch conversations and latest messages
  const conversations = Conversations.find({}, { sort: { updatedAt: -1 } }).fetch();

  // Enhance conversations with the latest message and user profile
  const enhancedConversations = conversations.map(conversation => {
    const latestMessage = Messages.findOne({ conversationId: conversation._id }, { sort: { createdAt: -1 } });

    const otherUserId = conversation.participants.find(participant => participant !== Meteor.userId());
    const profile = UserProfiles.findOne({ userId: otherUserId });
    console.log('Profile:', profile);

    return {
      _id: conversation._id, // Assuming your Conversations schema uses _id
      latestMessage,
      profile,
    };
  });

  return {
    conversations: enhancedConversations,
    isLoading,
  };
})(ConversationsList);
