import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Initialize the Mongo collection
const ConversationsMongoCollection = new Mongo.Collection('conversations');

// Define the schema
const ConversationSchema = new SimpleSchema({
  participants: {
    type: Array,
  },
  'participants.$': {
    type: String,
  },
  createdAt: {
    type: Date,
    defaultValue: () => new Date(), // Set default value to current date/time
  },
  lastMessage: {
    type: String,
    optional: true,
  },
  lastMessageAt: {
    type: Date,
    optional: true,
  },
});

// Attach the schema to the collection
ConversationsMongoCollection.attachSchema(ConversationSchema);

class ConversationsCollection {
  constructor(collection) {
    this._collection = collection;
  }

  // Define a new conversation
  define(conversationDetails) {
    try {
      const docId = this._collection.insert(conversationDetails);
      return docId;
    } catch (error) {
      throw new Meteor.Error('insert-failed', 'Could not insert conversation.');
    }
  }

  // Update an existing conversation
  update(docId, updateData) {
    try {
      const updateCount = this._collection.update(docId, { $set: updateData });
      return updateCount;
    } catch (error) {
      throw new Meteor.Error('update-failed', 'Could not update conversation.');
    }
  }

  // Remove a conversation
  removeIt(docId) {
    try {
      const removeCount = this._collection.remove(docId);
      return removeCount;
    } catch (error) {
      throw new Meteor.Error('remove-failed', 'Could not remove conversation.');
    }
  }

  // Add this method
  find(selector, options) {
    return this._collection.find(selector, options);
  }

  // You can also add a findOne method if needed
  findOne(selector, options) {
    return this._collection.findOne(selector, options);
  }
}

export const Conversations = new ConversationsCollection(ConversationsMongoCollection);
