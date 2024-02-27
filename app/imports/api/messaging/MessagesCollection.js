import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Messages = new Mongo.Collection('messages');

const MessageSchema = new SimpleSchema({
  text: {
    type: String,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
  },
  senderId: {
    type: String,
  },
  receiverId: {
    type: String,
  },
});

Messages.attachSchema(MessageSchema);

export default Messages;
