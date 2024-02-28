import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../../api/messaging/ConversationsCollection';
import { Messages } from '../../../api/messaging/MessagesCollection'; // Adjust the import path as necessary
import { UserProfiles } from '../../../api/user/UserProfileCollection'; // Adjust as necessary

// Assumes UserProfiles contains necessary info such as username or name
const getUserDetails = (userId) => {
  const user = UserProfiles.findOne(userId);

  return {
    avatar: user && user.profile && user.profile.picture ? user.profile.pciture : '/images/defaultuserprofile.png',
    name: user && user.profile && user.profile.firstName ? user.profile.firstName : 'Unknown User',
  };
};

const getOtherParticipantId = (participants, currentUserId) => participants.find(participantId => participantId !== currentUserId);
console.log('getOtherParticipantId:', Conversations.participants, Meteor.userId());
const ConversationsList = ({ conversations, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => {
          const currentUserId = Meteor.userId();
          const otherParticipantId = getOtherParticipantId(conversation.participants, currentUserId);
          const otherParticipantDetails = getUserDetails(otherParticipantId);
          console.log(getUserDetails(otherParticipantId));
          return (
            <li key={conversation._id}>
              <div>
                <p>
                  Conversation with:
                  <img src={otherParticipantDetails.avatar} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  {otherParticipantDetails.name}
                </p>
                <p>Last Message: {conversation.lastMessage.text}</p>
                <p>From: {getUserDetails(conversation.lastMessage.senderId).name}</p>
                <p>Sent: {conversation.lastMessage.createdAt.toLocaleString()}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default withTracker(() => {
  const handle = Meteor.subscribe('conversations.list');
  const isLoading = !handle.ready();
  let conversations = Conversations.find({}, { sort: { lastMessageAt: -1 } }).fetch();

  // Enhance conversations with last message details
  conversations = conversations.map(conversation => {
    const lastMessage = Messages.findOne({ conversationId: conversation._id }, { sort: { createdAt: -1 } });
    return {
      ...conversation,
      lastMessage: {
        text: lastMessage ? lastMessage.text : 'No messages yet',
        createdAt: lastMessage ? lastMessage.createdAt : new Date(0), // Default to epoch if no messages
        senderId: lastMessage ? lastMessage.senderId : null,
      },
    };
  });

  return {
    conversations,
    isLoading,
  };
})(ConversationsList);
