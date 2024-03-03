import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../../api/messaging/ConversationsCollection';
import { Messages } from '../../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../../api/user/UserProfileCollection';

const ConversationsList = ({ conversations, isLoading }) => {
  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!conversations.length) {
    return <div className="text-white">No conversations found.</div>;
  }

  return (
      <div className="w-full md:w-6/12 lg:w-5/12 xl:w-5/12 px-2 mb-4 md:mb-0">
        <h5 className="text-center text-white font-bold mb-3">Members</h5>
        <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl border border-white/5 p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
          {conversations.map(({ _id, latestMessage, profile }) => (
              <div key={_id} className="flex justify-between items-center p-2 border-b border-white/30" onClick={() => { /* navigate to conversation view */ }}>
                <div className="flex items-center">
                  <img
                      src={profile?.picture || '/images/defaultUserProfile.png'}
                      alt={`${profile?.firstName || 'Unknown User'}'s profile`}
                      className="rounded-full shadow-lg mr-3"
                      width="60"
                  />
                  <div>
                    <p className="font-bold text-white mb-0">{profile?.firstName || 'Unknown User'} {profile?.lastName || ''}</p>
                    <p className="text-white text-sm">{latestMessage?.text}</p>
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm mb-1">{latestMessage?.createdAt ? latestMessage.createdAt.toLocaleDateString() : ''}</p>
                  {latestMessage?.unread && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{latestMessage.unread}</span>}
                </div>
              </div>
          ))}
        </div>
      </div>
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

    return {
      _id: conversation._id,
      latestMessage,
      profile,
    };
  });

  return {
    conversations: enhancedConversations,
    isLoading,
  };
})(ConversationsList);
