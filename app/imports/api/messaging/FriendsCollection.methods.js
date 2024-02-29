// imports/api/friends/methods.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Friends } from './FriendsCollection';

Meteor.methods({
  'friends.request'(recipientId) {
    check(recipientId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Avoid sending a friend request to oneself
    if (this.userId === recipientId) {
      throw new Meteor.Error('invalid-operation', 'You cannot send a friend request to yourself');
    }

    // Check for existing friend request or relationship
    const existingDoc = Friends.findOne({
      $or: [
        { requesterId: this.userId, recipientId },
        { requesterId: recipientId, recipientId: this.userId },
      ],
    });

    if (existingDoc) {
      throw new Meteor.Error('request-already-exists', 'Friend request already exists or you are already friends');
    }

    return Friends.define({ requesterId: this.userId, recipientId });
  },

  'friends.confirm'(requesterId) {
    check(requesterId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
    }

    const friendship = Friends.findOne({
      $or: [
        { requesterId: this.userId, recipientId: requesterId, status: 'pending' },
        { requesterId, recipientId: this.userId, status: 'pending' },
      ],
    });

    if (!friendship) {
      throw new Meteor.Error('friendship-not-found', 'Friendship request not found or already confirmed.');
    }

    return Friends.updateFriendshipStatus(requesterId, this.userId, 'confirmed');
  },

  'users.findByNameOrEmail'(searchTerm) {
    check(searchTerm, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const searchRegex = new RegExp(searchTerm, 'i');
    const users = Meteor.users.find({
      $or: [
        { 'emails.address': searchRegex },
        { 'profile.firstName': searchRegex },
        { 'profile.lastName': searchRegex },
      ],
    }, {
      fields: { 'emails.address': 1, 'profile.firstName': 1, 'profile.lastName': 1 },
    }).fetch();

    return users.map(user => ({
      _id: user._id,
      email: user.emails[0].address,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
    }));
  },

  // Add methods for rejecting requests, removing friends, and retrieving the friend list as needed
});
