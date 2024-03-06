import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col } from 'react-bootstrap';
import ConversationsList from './ConversationsList';
import ConversationDetails from './ConversationsDetails';
import MessageForm from './MessageForm';
import UserSearch from './UserSearch';
// Adjust the path as necessary
import { Conversations } from '../../../api/messaging/ConversationsCollection';

const ChatInterface = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  const handleUserSelected = (user) => {
    const userId = user._id;
    Meteor.call('conversations.initiate', userId, (error, result) => {
      if (error) {
        console.error('Error initiating conversation:', error);
      } else {
        setActiveConversationId(result);
        // Determine receiverId directly here if possible
        setReceiverId(userId); // Assuming the initiated conversation is with the selected user
      }
    });
  };

  useEffect(() => {
    if (activeConversationId) {
      const activeConversation = Conversations.findOne({ _id: activeConversationId });
      if (activeConversation) {
        const newReceiverId = activeConversation.participants.find(participantId => participantId !== Meteor.userId());
        setReceiverId(newReceiverId);
      }
    }
  }, [activeConversationId]);

  return (
    <Container fluid className="chat-interface">
      <Row className="h-100">
        <Col md={4} className="overflow-auto">
          <UserSearch onUserSelected={handleUserSelected} />
          <ConversationsList onSelectConversation={setActiveConversationId} activeConversationId={activeConversationId} />
        </Col>
        <Col md={8} className="overflow-auto">
          {activeConversationId && (
            <>
              <ConversationDetails conversationId={activeConversationId} />
              {receiverId && <MessageForm conversationId={activeConversationId} receiverId={receiverId} />}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatInterface;
