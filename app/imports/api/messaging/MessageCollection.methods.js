// /imports/api/messages/methods.js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Messages from './MessagesCollection';

Meteor.methods({
  'messages.sendByEmail'(messageText, recipientEmail) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }
    // Find recipient by email
    const recipient = Accounts.findUserByEmail(recipientEmail);
    if (!recipient) {
      throw new Meteor.Error('recipient-not-found', 'No user found with that email address.');
    }

    // Insert the message into the database
    Messages.insert({
      text: messageText,
      createdAt: new Date(),
      senderId: this.userId,
      receiverId: recipient._id,
    });
    // Possibly send a notification to the recipient, etc.
  },
});
