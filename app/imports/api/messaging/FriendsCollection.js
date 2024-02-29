// imports/api/friends/FriendsCollection.js
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

const FriendSchema = new SimpleSchema({
  requesterId: String,
  recipientId: String,
  status: {
    type: String,
    allowedValues: ['pending', 'confirmed'],
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
  },
});

/**
 * Represents a collection of friend relationships between users.
 */
class FriendsCollection extends BaseCollection {
  constructor() {
    super('Friends', FriendSchema);
  }

  /**
   * Defines a new friend request or relationship.
   * @param {Object} params - Parameters for defining a new friendship.
   * @param {string} params.requesterId - The user ID of the friend request sender.
   * @param {string} params.recipientId - The user ID of the friend request recipient.
   * @param {string} [params.status='pending'] - The initial status of the friend request.
   * @returns {string} The document ID of the newly created friend request.
   */
  define({ requesterId, recipientId, status = 'pending' }) {
    const docId = this._collection.insert({ requesterId, recipientId, status, createdAt: new Date() });
    return docId;
  }

  /**
   * Updates the status of a friendship (e.g., confirm a friend request).
   * @param {string} requesterId - The user ID of the friend request sender.
   * @param {string} recipientId - The user ID of the friend request recipient.
   * @param {string} status - The new status of the friendship.
   * @returns {number} The number of documents updated.
   * @throws {Meteor.Error} Throws an error if the friendship relationship is not found.
   */
  updateFriendshipStatus(requesterId, recipientId, status) {
    const doc = this._collection.findOne({ requesterId, recipientId });
    if (doc) {
      return this._collection.update(doc._id, { $set: { status } });
    }
    throw new Meteor.Error('friendship-not-found', 'Friendship relationship not found.');
  }

  // Implement additional methods as needed for the friend list feature
}

export const Friends = new FriendsCollection();
