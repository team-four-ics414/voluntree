import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Conversations } from './ConversationsCollection';
import { Messages } from './MessagesCollection';

Meteor.methods({
  'messages.send'(messageText, participantIds) {
    check(messageText, String);
    check(participantIds, [String]);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }

    // Ensure all participants include the sender
    if (!participantIds.includes(this.userId)) {
      participantIds.push(this.userId);
    }

    // Find or create conversation
    let conversation = Conversations.findOne({ participants: { $all: participantIds, $size: participantIds.length } });
    if (!conversation) {
      conversation = {
        _id: Conversations.insert({
          participants: participantIds,
          createdAt: new Date(),
        }),
      };
    }

    // Insert message linked to the conversation
    Messages.insert({
      text: messageText,
      createdAt: new Date(),
      senderId: this.userId,
      conversationId: conversation._id,
    });

    // Update conversation last message info
    Conversations.update(conversation._id, {
      $set: {
        lastMessage: messageText,
        lastMessageAt: new Date(),
      },
    });
  },
});

/* Create or Update Conversation
This method checks if a conversation between participants already exists. If so, it updates the conversation's last message details; if not, it creates a new conversation. */
Meteor.methods({
  'conversations.upsert'(participantIds, lastMessageText) {
    check(participantIds, [String]);
    check(lastMessageText, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update conversations.');
    }

    const conversation = Conversations.findOne({ participants: { $all: participantIds, $size: participantIds.length } });

    if (conversation) {
      Conversations.update(conversation._id, {
        $set: {
          lastMessage: lastMessageText,
          lastMessageAt: new Date(),
        },
      });
    } else {
      Conversations.insert({
        participants: participantIds,
        createdAt: new Date(),
        lastMessage: lastMessageText,
        lastMessageAt: new Date(),
      });
    }
  },
});

/* Retrieve Conversations for a User
This method fetches all conversations a user is part of, potentially with some basic pagination support. */
Meteor.methods({
  'conversations.forUser'(limit = 10) {
    check(limit, Number);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to view conversations.');
    }

    return Conversations.find({ participants: this.userId }, { sort: { lastMessageAt: -1 }, limit: limit }).fetch();
  },
});

/* Send Message in a Conversation
This method is an extension of the messages.sendByEmail method you provided, tailored for sending messages within a conversation context. */
Meteor.methods({
  'messages.sendToConversation'(conversationId, messageText) {
    check(conversationId, String);
    check(messageText, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }

    const conversation = Conversations.findOne({ _id: conversationId });
    if (!conversation) {
      throw new Meteor.Error('conversation-not-found', 'No conversation found with that ID.');
    }

    Messages.define({
      text: messageText,
      createdAt: new Date(),
      senderId: this.userId,
      conversationId: conversationId,
    });

    // Update conversation last message info
    Meteor.call('conversations.upsert', conversation.participants, messageText);
  },
});
