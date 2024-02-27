import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Messages } from './MessagesCollection'; // Ensure you're importing the instance of your collection class

Meteor.methods({
  'messages.sendByEmail'(messageText, recipientEmail) {
    check(messageText, String);
    check(recipientEmail, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send messages.');
    }

    const recipient = Accounts.findUserByEmail(recipientEmail);
    if (!recipient) {
      throw new Meteor.Error('recipient-not-found', 'No user found with that email address.');
    }

    Messages.define({
      text: messageText,
      createdAt: new Date(),
      senderId: this.userId,
      receiverId: recipient._id,
    });
    console.log('Message sent to', recipientEmail, 'from', this.userId, 'with text', messageText, 'at', new Date(), 'recipient ID:', recipient._id, 'sender ID:', this.userId);
  },
});
