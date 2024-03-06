import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

// Define the schema for a message
const MessageSchema = new SimpleSchema({
  text: String,
  createdAt: {
    type: Date,
    defaultValue: () => new Date(), // Use a function for dynamic defaults
  },
  senderId: String,
  receiverId: String,
  conversationId: String,
  // Add any other fields that might be necessary for your application
});

class MessagesCollection extends BaseCollection {
  constructor() {
    super('Messages', MessageSchema);
  }

  /**
   * Defines a new message.
   * @param {Object} messageDetails The details of the message.
   * @returns {String} The ID of the newly created message document.
   */
  define(messageDetails) {
    // Implement additional validation or preprocessing as needed
    const docId = this._collection.insert(messageDetails);
    return docId;
  }

  /**
   * Updates an existing message.
   * @param {String} docId The ID of the message to update.
   * @param {Object} updateData The update operation or data to apply.
   * @returns {Number} The number of documents affected.
   */
  update(docId, updateData) {
    const updateCount = this._collection.update(docId, { $set: updateData });
    if (updateCount === 0) {
      throw new Meteor.Error('update-failed', 'Could not update message. No message found with provided ID.');
    }
    return updateCount;
  }

  /**
   * Retrieves all messages for a given conversation.
   * @param {String} conversationId The ID of the conversation.
   * @returns {Array} An array of message documents.
   */
  findMessagesByConversation(conversationId) {
    return this._collection.find({ conversationId }).fetch();
  }

  // Additional methods as necessary, following the patterns established in BaseCollection
}

export const Messages = new MessagesCollection();
