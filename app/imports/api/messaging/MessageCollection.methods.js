import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Messages } from './MessagesCollection'; // Ensure correct import path
import { Conversations } from './ConversationsCollection'; // Ensure correct import path

Meteor.methods({
  /**
   * Sends a message to a user identified by their email, creating or updating a conversation as necessary.
   *
   * @param {string} messageText - The text of the message to send.
   * @param {string} recipientEmail - The email address of the recipient.
   * @throws {Meteor.Error} - Throws if not authorized, recipient not found, or operation fails.
   */
  'messages.sendByEmail'(text, recipientEmail) {
    check(text, String);
    check(recipientEmail, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }

    const recipient = Accounts.findUserByEmail(recipientEmail);
    if (!recipient) {
      throw new Meteor.Error('recipient-not-found', 'No user found with that email address.');
    }

    // Find or create a conversation between the current user and the recipient
    const conversation = Conversations.findOne({
      participants: { $all: [this.userId, recipient._id] },
    });

    let conversationId;
    if (!conversation) {
      // Assuming Conversations.define is implemented correctly
      conversationId = Conversations.define({
        participants: [this.userId, recipient._id],
        createdAt: new Date(),
      });
    } else {
      conversationId = conversation._id;
    }

    // Insert the message with the conversationId using the define method
    try {
      const messageId = Messages.define({
        text: text,
        createdAt: new Date(),
        senderId: this.userId,
        receiverId: recipient._id,
        conversationId: conversationId,
      });

      // Log the successful message insertion or handle it as needed
      console.log('Message sent, ID:', messageId);
    } catch (error) {
      console.error('Error inserting message:', error);
      throw new Meteor.Error('message-insert-failed', 'Could not insert message.');
    }

    return conversationId; // Return the conversation ID to the client
  },

  /**
   * Inserts a new message into the Messages collection.
   *
   * @param {Object} messageDetails - Details of the message to insert.
   * @returns {string} - The ID of the newly inserted message.
   * @throws {Meteor.Error} - Throws if the operation fails.
   */
  'messages.insert'(messageDetails) {
    check(messageDetails, {
      text: String,
      senderId: Match.Where(id => {
        check(id, String);
        return id === this.userId; // Ensure the senderId matches the current user's ID for security
      }),
      receiverId: String,
      conversationId: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to insert messages.');
    }

    try {
      const messageId = Messages.define(messageDetails);
      console.log('Message inserted, ID:', messageId);
      return messageId; // Return the newly inserted message ID
    } catch (error) {
      console.error('Error inserting message:', error);
      throw new Meteor.Error('messages.insert.failed', error.message);
    }
  },

  // Existing methods...

  /**
   * Adds a new message to an existing conversation.
   *
   * @param {Object} params - Parameters for the new message.
   * @param {String} params.text - The text content of the message.
   * @param {String} params.conversationId - The ID of the conversation to which the message belongs.
   * @throws {Meteor.Error} - Throws if not authorized or operation fails.
   */
  'messages.add'({ text, conversationId, receiverId }) {
    console.log('Attempting to add message', { text, conversationId, userId: this.userId, receiverId });
    check(text, String);
    check(conversationId, String);
    check(receiverId, String); // Ensure receiverId is validated

    if (!receiverId) {
      console.error('receiverId is undefined');

      throw new Meteor.Error('receiverId-undefined', 'receiverId must be provided.');
    }
    check(receiverId, String); // Validate receiverID making sure it's not undefine
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to add messages.');
    }

    const conversation = Conversations.findOne({ _id: conversationId, participants: this.userId });
    if (!conversation) {
      throw new Meteor.Error('conversation-not-found', 'Conversation not found or user not a participant.');
    }

    try {
      const messageId = Messages.define({
        text,
        conversationId,
        senderId: this.userId,
        receiverId, // Include receiverId here
        createdAt: new Date(),
      });
      console.log('Message added successfully', messageId);

      // Update conversation logic as needed...

      return messageId;
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Meteor.Error('message-add-failed', 'Could not add message.');
    }
  },

});
