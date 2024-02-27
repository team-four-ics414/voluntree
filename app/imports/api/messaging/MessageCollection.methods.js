// /imports/api/messages/methods.js
import { Meteor } from 'meteor/meteor';
import Messages from './messages.js';

Meteor.methods({
  'messages.send'(text, email) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    // Find the user by email
    const receiver = Accounts.findUserByEmail(email);
    if (!receiver) {
      throw new Meteor.Error('Receiver not found.');
    }

    // Insert the message
    Messages.insert({
      text,
      senderId: this.userId,
      receiverId: receiver._id,
      createdAt: new Date(),
    });
  },
});
