import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Ensure prop types are imported for validation
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Messages } from '../../api/messaging/MessagesCollection';

/**
 * ConversationDetails component displays the details of a specific conversation,
 * including a list of messages. It also handles loading states and automatically
 * scrolls to the latest message when the messages update.
 *
 * @param {{ conversationId: string, messages: Array, isLoading: boolean }} props Component props.
 */
const ConversationDetails = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  // Effect to scroll to the latest message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle loading state
  if (isLoading) {
    return <div className="p-4 text-center">Loading messages...</div>;
  }

  // Handle case when there are no messages
  if (messages.length === 0) {
    return <div className="p-4 text-center">No messages in this conversation.</div>;
  }

  // Render messages if available
  return (
    <div className="p-4 overflow-auto">
      {messages.map((message) => (
        <div key={message._id} className={`message ${message.senderId === Meteor.userId() ? 'sent' : 'received'}`}>
          <div className="text-sm">{message.text}</div>
          <div className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleTimeString()}</div>
        </div>
      ))}
      <div ref={endOfMessagesRef} /> {/* Reference for auto-scrolling */}
    </div>
  );
};

// Prop validation for type checking
ConversationDetails.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker((props) => {
  const { conversationId } = props;
  const messagesSubscription = Meteor.subscribe('messages.inConversation', conversationId);

  const isLoading = !messagesSubscription.ready();
  const messages = Messages.find({ conversationId }, { sort: { createdAt: 1 } }).fetch();

  return {
    isLoading,
    messages,
  };
})(ConversationDetails);
