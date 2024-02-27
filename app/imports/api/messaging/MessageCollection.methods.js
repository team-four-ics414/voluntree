import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Messages } from './MessagesCollection'; // Ensure you're importing the instance of your collection class

Meteor.methods({
  'messages.sendByEmail'(messageText, recipientEmail) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }

    const sender = Meteor.users.findOne(this.userId);
    const recipient = Accounts.findUserByEmail(recipientEmail);
    if (!recipient) {
      throw new Meteor.Error('recipient-not-found', 'No user found with that email address.');
    }

    const senderName = sender.profile ? sender.profile.name : "Sender's Name"; // Adjust based on your user schema

    Messages.define({
      text: messageText,
      createdAt: new Date(),
      senderId: this.userId,
      senderName: senderName, // Now including senderName
      receiverId: recipient._id,
    });
  },
});
