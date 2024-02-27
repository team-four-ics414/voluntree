import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection'; // Adjust the path as necessary

// Define the schema for a message
const MessageSchema = new SimpleSchema({
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(), // Consider using a function here if you want the default value to be the insertion time
  },
  senderId: {
    type: String,
  },
  receiverId: {
    type: String,
  },
  // Extend with more fields as needed
});

class MessagesCollection extends BaseCollection {
  constructor() {
    super('Messages', MessageSchema);
  }

  /**
   * Defines a new message.
   * @param {Object} messageDetails - The details of the message.
   * @returns {String} The docID of the created document.
   */
  define(messageDetails) {
    try {
      const docId = this._collection.insert(messageDetails);
      return docId;
    } catch (error) {
      // Handle or log error appropriately
      throw new Meteor.Error('insert-failed', 'Could not insert message.');
    }
  }

  /**
   * Updates an existing message.
   * @param docId {String} - The ID of the document to update.
   * @param {Object} updateData - The data to update the document with.
   */
  update(docId, updateData) {
    const updateCount = this._collection.update(docId, { $set: updateData });
    return updateCount;
  }

  removeIt(docId) {
    const removeCount = this._collection.remove(docId);
    return removeCount;
  }
  // Implement additional methods as necessary, following the patterns established in BaseCollection
}

export const Messages = new MessagesCollection();
