import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Conversations } from './ConversationsCollection';
import { Messages } from './MessagesCollection';

Meteor.methods({
  /**
   * Creates a new conversation with given participant IDs.
   *
   * @param {Array} participantIds - Array of participant user IDs.
   * @returns {string} The ID of the newly created conversation.
   * @throws {Meteor.Error} if the operation fails.
   */
  'conversations.create'(participantIds) {
    check(participantIds, [String]);

    // Additional validation can be performed here

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
    }

    try {
      const conversationId = Conversations.define({ participants: participantIds });
      return conversationId;
    } catch (error) {
      throw new Meteor.Error('conversations.create.failed', error.message);
    }
  },

  /**
   * Adds a message to a specified conversation.
   *
   * @param {string} conversationId - The ID of the conversation.
   * @param {Object} messageDetails - The details of the message including text and optionally other data.
   * @returns {string} The ID of the newly added message.
   * @throws {Meteor.Error} if the operation fails or validation fails.
   */
  'conversations.addMessage'(conversationId, messageDetails) {
    check(conversationId, String);
    check(messageDetails, {
      text: String,
      // Extend with other fields as necessary
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
    }

    // Validate messageDetails structure and content as necessary

    try {
      const messageId = Messages.define({
        ...messageDetails,
        conversationId,
        senderId: this.userId,
        createdAt: new Date(),
      });
      Conversations.update(conversationId, { lastUpdated: new Date() }); // Update the conversation's lastUpdated field
      return messageId;
    } catch (error) {
      throw new Meteor.Error('conversations.addMessage.failed', error.message);
    }
  },

  'getLatestMessageForConversations'(conversationIds) {
    check(conversationIds, [String]);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const latestMessages = conversationIds.map(id => Messages.findOne({ conversationId: id }, { sort: { createdAt: -1 } }));

    return latestMessages.filter(Boolean); // Filter out any undefined entries
  },

  'addMessage'(conversationId, messageDetails) {
    check(conversationId, String);
    check(messageDetails, {
      text: String,
    });
    const messageId = Messages.define({
      ...messageDetails,
      conversationId,
    });
    this._collection.update(conversationId, {
      $set: {
        lastUpdated: new Date(),
        lastMessage: messageDetails.text,
        lastMessageCreatedAt: new Date(),
      },
    });
    return messageId;
  },

  // Additional methods related to conversations and messages can follow here
});
