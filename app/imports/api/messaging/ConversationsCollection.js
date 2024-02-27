import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Conversations = new Mongo.Collection('conversations');

const ConversationSchema = new SimpleSchema({
  participants: {
    type: Array,
  },
  'participants.$': {
    type: String,
  },
  createdAt: {
    type: Date,
    defaultValue: new Date(),
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

Conversations.attachSchema(ConversationSchema);

export default Conversations;
