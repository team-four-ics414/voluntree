import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Messages } from './MessagesCollection'; // Ensure you're importing the instance of your collection class
import { Conversations } from './ConversationsCollection'; // Ensure you're importing the instance of your collection class

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

    // Assuming Conversations collection has a similar method for adding/updating conversations
    let conversation = Conversations.findOne({
      participants: { $all: [this.userId, recipient._id] },
    });

    if (!conversation) {
      // Use your custom method for adding a conversation
      conversation = Conversations.define({
        participants: [this.userId, recipient._id],
        createdAt: new Date(),
        lastMessage: messageText,
        lastMessageAt: new Date(),
      });
    } else {
      // Update the existing conversation with new message info
      Conversations.update(conversation._id, {
        $set: {
          lastMessage: messageText,
          lastMessageAt: new Date(),
        },
      });
    }

    // Insert the message using the custom define method in Messages collection
    Messages.define({
      text: messageText,
      createdAt: new Date(),
      senderId: this.userId,
      receiverId: recipient._id,
      conversationId: conversation._id, // Assuming you want to link the message to the conversation
    });

    // Log the operation or handle post-message-sending actions
    console.log('Message sent to', recipientEmail, 'from', this.userId, 'with text', messageText, 'at', new Date(), 'recipient ID:', recipient._id, 'sender ID:', this.userId);
  },
});
