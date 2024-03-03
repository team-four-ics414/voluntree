import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../api/messaging/ConversationsCollection';
import { Messages } from '../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const ChatComponent = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null); // Assuming this gets set when a conversation is selected
  const endOfMessagesRef = useRef(null);

  // Fetching conversations and their latest messages
  const { conversations, isLoading: isLoadingConversations } = useTracker(() => {
    const noDataAvailable = { conversations: [] };
    const conversationsHandle = Meteor.subscribe('conversations.list');
    const profilesHandle = Meteor.subscribe('UserProfilesPublication');

    if (!conversationsHandle.ready() || !profilesHandle.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const conversations = Conversations.find({}, { sort: { updatedAt: -1 } }).fetch().map(conversation => {
      const latestMessage = Messages.findOne({ conversationId: conversation._id }, { sort: { createdAt: -1 } });
      const otherUserId = conversation.participants.find(id => id !== Meteor.userId());
      const profile = UserProfiles.findOne({ userID: otherUserId });

      return {
        ...conversation,
        latestMessage,
        profile,
      };
    });

    return { conversations, isLoading: false };
  }, []);

  // Fetching messages for the active conversation
  const { messages, isLoading: isLoadingMessages } = useTracker(() => {
    const noDataAvailable = { messages: [] };
    if (!activeConversationId) return noDataAvailable;

    console.log('Active Conversation ID:', activeConversationId); // Debugging line
    const messagesHandle = Meteor.subscribe('messages.inConversation', activeConversationId); // Ensure this matches your publication name
    if (!messagesHandle.ready()) {
      console.log('Subscription is not ready'); // Debugging line
      return { ...noDataAvailable, isLoading: true };
    }

    const fetchedMessages = Messages.find({ conversationId: activeConversationId }, { sort: { createdAt: 1 } }).fetch();
    console.log('Fetched Messages:', fetchedMessages); // Debugging line
    return { messages: fetchedMessages, isLoading: false };
  }, [activeConversationId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    const conversation = Conversations.findOne(conversationId);

    if (!conversation) {
      console.error('Conversation not found!');
      return;
    }

    const otherUserId = conversation.participants.find(id => id !== Meteor.userId());
    setReceiverId(otherUserId);
  };

  // Client: ChatComponent.js or wherever your component is defined
  const sendMessage = () => {
    if (!currentMessage.trim()) {
      alert('Please enter a message.');
      return;
    } if (!activeConversationId) {
      alert('Please select a conversation.');
      return;
    } if (!receiverId) {
      console.error('Receiver ID is missing.'); // Additional logging for troubleshooting
      alert('An error occurred. Please try again later.');
      return;
    }

    console.log('Sending message with:', {
      message: currentMessage,
      conversationId: activeConversationId,
      receiverId,
    });

    Meteor.call('messages.add', {
      text: currentMessage,
      conversationId: activeConversationId,
      receiverId,
    }, (error, result) => {
      if (error) {
        console.error(`Failed to send message: ${error}`);
        alert(`Failed to send message: ${error.message}`);
      } else {
        console.log('Message sent successfully, message ID:', result);
        setCurrentMessage(''); // Clear the input field after sending
      }
    });
  };

  if (isLoadingConversations) {
    return <div>Loading conversations...</div>;
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;

  }

  return (
    <section className="gradient-custom h-screen">
      <div className="container py-5 mx-auto">
        <div className="flex flex-wrap -mx-2 ">
          {/* Members/Conversations List */}
          <div className="w-full md:w-6/12 lg:w-5/12 xl:w-5/12 px-2 mb-4 md:mb-0">
            <h5 className="text-center text-white font-bold mb-3">Members</h5>
            <div className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
              {conversations.map(({ _id, latestMessage, profile }) => (
                <button
                  key={_id}
                  type="button"
                  className={`flex justify-between items-center p-2 border-b 
                    border-white/30 but ${activeConversationId === _id ?
                  'backdrop-blur-md rounded-lg p-4 shadow' : ''}`}
                  onClick={() => handleSelectConversation(_id)}
                >
                  <div className="flex items-center">
                    <img src={profile?.picture || '/images/defaultUserProfile.png'} alt="Avatar" className="rounded-circle shadow-1-strong me-3" width="60" />
                    <div>
                      <p className="font-bold text-white mb-0">{profile?.firstName} {profile?.lastName}</p>
                      <p className="text-white text-sm">{truncateText(latestMessage?.text, 20)}</p>
                    </div>
                  </div>
                  {/* Placeholder for unread message count, if applicable */}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Display Area */}
          <div className="w-full md:w-6/12 lg:w-7/12 xl:w-7/12 px-2">
            {isLoadingMessages ? (
              <div className="text-center py-4 text-white">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-4 text-white">No messages in this conversation.</div>
            ) : (
              <div className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
                {messages.map((message) => {
                  const isSentByCurrentUser = message.senderId === Meteor.userId();
                  const senderProfile = UserProfiles.findOne({ userID: message.senderId });
                  const avatarUrl = senderProfile?.picture || '/images/defaultUserProfile.png';
                  const senderName = isSentByCurrentUser ? 'You' : (senderProfile?.firstName || 'Unknown');

                  return (
                    <div key={message._id} className={`mb-4 flex ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                      <img src={avatarUrl} alt="Avatar" className="rounded-full shadow-lg w-10 h-10 ml-3" />
                      <div className={`flex flex-col ${isSentByCurrentUser ? 'items-end' : 'items-start'} message-container`}>
                        <div className="backdrop-blur-md rounded-lg p-4 shadow">
                          <p className="font-bold text-white">{senderName}</p>
                          <p className="text-white break-words message-content">{message.text}</p>
                          <p className="text-xs text-white">{new Date(message.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={endOfMessagesRef} />
              </div>
            )}
            <div className="mt-4">
              <textarea
                className="form-control w-full rounded-lg bg-white/20 p-2 text-white"
                rows="4"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-light btn-lg btn-rounded float-right mt-2"
                onClick={sendMessage} // Confirm this is correctly set
              >
                Send
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatComponent;
