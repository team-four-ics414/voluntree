import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Conversations } from '../../api/messaging/ConversationsCollection';
import { Messages } from '../../api/messaging/MessagesCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { getTimeSince } from '../utilities/GetTimeSince';
import UserSearch from './UserSearch';

const ChatComponent = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const endOfMessagesRef = useRef(null);
  const messageRefs = useRef({});

  // Define focus functions before use
  const focusFirstMessage = (messageList) => {
    if (messageList && messageList.length > 0) {
      const firstMessageId = messageList[0]._id;
      if (messageRefs.current[firstMessageId]) {
        messageRefs.current[firstMessageId].focus();
      }
    }
  };

  const focusLatestMessage = (messageList) => {
    if (messageList && messageList.length > 0) {
      const latestMessageId = messageList[messageList.length - 1]._id;
      if (messageRefs.current[latestMessageId]) {
        messageRefs.current[latestMessageId].focus();
      }
    }
  };

  const { conversations, isLoading: isLoadingConversations } = useTracker(() => {
    const noDataAvailable = { conversations: [] };
    const conversationsHandle = Meteor.subscribe('conversations.list');
    const profilesHandle = Meteor.subscribe('UserProfilesPublication');

    if (!conversationsHandle.ready() || !profilesHandle.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const fetchedConversations = Conversations.find({}, { sort: { updatedAt: -1 } }).fetch().map(conversation => {
      const latestMessage = Messages.findOne({ conversationId: conversation._id }, { sort: { createdAt: -1 } });
      const otherUserId = conversation.participants.find(id => id !== Meteor.userId());
      const profile = UserProfiles.findOne({ userID: otherUserId });

      return {
        ...conversation,
        latestMessage,
        profile,
      };
    });

    return { conversations: fetchedConversations, isLoading: false };
  }, []);

  const { messages, isLoading: isLoadingMessages } = useTracker(() => {
    const noDataAvailable = { messages: [] };
    if (!activeConversationId) return noDataAvailable;

    const messagesHandle = Meteor.subscribe('messages.inConversation', activeConversationId);
    if (!messagesHandle.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const fetchedMessages = Messages.find({ conversationId: activeConversationId }, { sort: { createdAt: 1 } }).fetch();
    return { messages: fetchedMessages, isLoading: false };
  }, [activeConversationId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    focusLatestMessage(messages);
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
    focusFirstMessage(messages);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) {
      alert('Please enter a message.');
      return;
    }
    if (!activeConversationId) {
      alert('Please select a conversation.');
      return;
    }
    if (!receiverId) {
      console.error('Receiver ID is missing.');
      alert('An error occurred. Please try again later.');
      return;
    }

    Meteor.call('messages.add', {
      text: currentMessage,
      conversationId: activeConversationId,
      receiverId,
    }, (error) => { // Prefix unused variable with an underscore
      if (error) {
        console.error(`Failed to send message: ${error}`);
        alert(`Failed to send message: ${error.message}`);
      } else {
        setCurrentMessage('');
      }
    });
  };

  if (isLoadingConversations) {
    return <div className="text-center">Loading conversations...</div>;
  }

  function truncateText(text = '', maxLength) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  const handleUserSelected = (user) => {
    const userId = user._id;
    console.log('Calling initiate with userId:', userId);
    Meteor.call('conversations.initiate', userId, (error, result) => {
      if (error) {
        console.error('Error initiating conversation:', error);
      } else {
        console.log('Conversation initiated with ID:', result);
        setActiveConversationId(result);
      }
    });
  };

  return (
    <section className="h-100 gradient-custom h-screen">
      <div className="container py-5 mx-auto">
        <div className="flex flex-wrap -mx-2 ">
          {/* Members/Conversations List */}
          <div className="w-full md:w-6/12 lg:w-5/12 xl:w-5/12 px-2 mb-4 md:mb-0">
            <h5 className="text-center text-white font-bold mb-3">Conversations</h5>

            <ul className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
              <UserSearch onUserSelected={handleUserSelected} />

              {conversations.map(({ _id, latestMessage, profile }) => (
                <li key={_id} className="border-b border-white/30">
                  <button
                    type="button"
                    aria-label={`Conversation with ${profile?.firstName} ${profile?.lastName}`}
                    className={`w-full text-left flex justify-between items-center p-2 ${activeConversationId === _id ? 'backdrop-blur-md rounded-lg shadow' : ''}`}
                    onClick={() => handleSelectConversation(_id)}
                  >
                    <div className="flex items-center">
                      <img src={profile?.picture || '/images/defaultUserProfile.png'} alt="Avatar" className="rounded-circle shadow-1-strong me-3" width="60" />
                      <div>
                        <p className="font-bold text-white mb-0">{profile?.firstName} {profile?.lastName}</p>
                        <p className="text-white text-sm">{truncateText(latestMessage?.text, 20)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white text-sm mb-1">{latestMessage ? `${getTimeSince(latestMessage.createdAt)} ago` : 'No messages'}</p>
                      {latestMessage?.unreadCount > 0 && <span className="badge bg-danger float-end">{latestMessage?.unreadCount}</span>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

          </div>

          {/* Messages Display Area */}
          <div className="w-full md:w-6/12 lg:w-7/12 xl:w-7/12 px-2">
            {
              (() => {
                if (isLoadingMessages) {
                  return <div className="text-center py-4 text-white">Loading messages...</div>;
                }
                if (messages.length === 0) {
                  return <div className="text-center py-4 text-white">No messages in this conversation.</div>;
                }
                return (
                  <div className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }} role="log">
                    {messages.map((message) => {
                      const isSentByCurrentUser = message.senderId === Meteor.userId();
                      const senderProfile = UserProfiles.findOne({ userID: message.senderId });
                      const avatarUrl = senderProfile?.picture || '/images/defaultUserProfile.png';
                      const senderName = isSentByCurrentUser ? 'You' : (senderProfile?.firstName || 'Unknown');

                      return (
                        <div className={`mb-4 flex ${isSentByCurrentUser ? 'flex-row-reverse' : ''}`}>
                          <img src={avatarUrl} alt="Avatar" className="rounded-full shadow-lg w-10 h-10 ml-3" />
                          <div
                            key={message._id}
                            className={`flex flex-col ${isSentByCurrentUser ? 'items-end' : 'items-start'} message-container`}
                            ref={el => {
                              messageRefs.current[message._id] = el;
                            }}
                          >
                            <div className="= rounded-lg p-4 shadow">
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
                );
              })()
            }
            <div className="mt-4">
              <textarea
                className="form-control w-full rounded-lg bg-white/20 p-2 text-white gradient-custom border-none"
                rows="4"
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-light btn-lg btn-rounded float-right mt-2"
                onClick={sendMessage}
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
