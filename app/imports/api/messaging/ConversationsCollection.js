import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Messages } from './MessagesCollection';

// Define the schema for a conversation
const ConversationSchema = new SimpleSchema({
  participants: {
    type: Array,
  },
  'participants.$': {
    type: String,
  },
  createdAt: {
    type: Date,
    defaultValue: () => new Date(), // Use a function for dynamic defaults
  },
  lastUpdated: {
    type: Date,
    defaultValue: () => new Date(),
  },
  lastMessage: {
    type: String,
    optional: true,
  },
  lastMessageCreatedAt: {
    type: Date,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['seen', 'delivered', 'sent'],
    optional: true,
  },
  type: {
    type: String,
    allowedValues: ['personal', 'work', 'other'],
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  // Add any other fields that might be necessary for your application
});

class ConversationsCollection extends BaseCollection {
  constructor() {
    super('Conversations', ConversationSchema);
  }

  /**
   * Defines a new conversation.
   * @param {Object} conversationDetails The details of the conversation.
   * @returns {String} The ID of the newly created conversation document.
   */
  define(conversationDetails) {
    const newConversationDetails = {
      ...conversationDetails,
      createdAt: conversationDetails.createdAt || new Date(),
      lastUpdated: conversationDetails.lastUpdated || new Date(),
    };

    // Implement additional validation or preprocessing as needed
    const docId = this._collection.insert(newConversationDetails);
    return docId;
  }

  /**
   * Adds a message to a conversation and updates the lastUpdated field.
   * @param {String} conversationId The ID of the conversation.
   * @param {Object} messageDetails The details of the message to add.
   * @returns {String} The ID of the newly added message.
   */
  addMessage(conversationId, messageDetails) {
    const messageId = Messages.define({
      ...messageDetails,
      conversationId,
    });
    this.update(conversationId, { lastUpdated: new Date() }); // Ensure this matches your schema
    return messageId;
  }

  /**
   * Updates an existing conversation.
   * @param {String} docId The ID of the conversation to update.
   * @param {Object} updateData The update operation or data to apply.
   * @returns {Number} The number of documents affected.
   */
  update(docId, updateData) {
    const updateCount = this._collection.update(docId, { $set: updateData });
    return updateCount;
  }

  /**
   * Removes a conversation.
   * @param {String} docId The ID of the document to remove.
   * @returns {Number} The number of documents removed.
   */
  removeIt(docId) {
    const removeCount = this._collection.remove(docId);
    return removeCount;
  }

  /**
   * Updates the status of a conversation.
   * @param {String} conversationId The ID of the conversation.
   * @param {String} status The new status of the conversation.
   * @returns {Number} The number of documents affected.
   */
  updateStatus(conversationId, status) {
    return this.update(conversationId, { status });
  }

  /**
   * Sets the title of a conversation, useful for group chats.
   * @param {String} conversationId The ID of the conversation.
   * @param {String} title The title of the conversation.
   * @returns {Number} The number of documents affected.
   */
  setTitle(conversationId, title) {
    return this.update(conversationId, { title });
  }

  /**
   * Changes the type of a conversation.
   * @param {String} conversationId The ID of the conversation.
   * @param {String} type The new type of the conversation.
   * @returns {Number} The number of documents affected.
   */
  updateType(conversationId, type) {
    return this.update(conversationId, { type });
  }

  // Implement additional methods as needed, following the structure and practices from BaseCollection
}

export const Conversations = new ConversationsCollection();
