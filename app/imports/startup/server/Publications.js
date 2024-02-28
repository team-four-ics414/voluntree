import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { MATPCollections } from '../../api/matp/MATPCollections';
import { Calendars } from '../../api/calendar/CalendarCollection';
import { Activity } from '../../api/activities/ActivityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Messages } from '../../api/messaging/MessagesCollection';
import { Conversations } from '../../api/messaging/ConversationsCollection';
// Call publish for all the collections.
MATPCollections.collections.forEach(c => c.publish());

// alanning:roles publication
// Recommended code to publish roles for each user.
// eslint-disable-next-line consistent-return
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  this.ready();
});

// Publish all calendars
Meteor.publish('calendar.all', function publishCalendarAll() {
  return Calendars.find({});
});

// Publish recent activities
Meteor.publish('recentActivities.public', function publishRecentActivities() {
  return Activity.find({}, { sort: { createdAt: -1 }, limit: 3 });
});

// Publish this week's calendars
Meteor.publish('calendar.thisWeek', function publishCalendarThisWeek() {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  endOfWeek.setHours(23, 59, 59, 999);

  return Calendars.find({
    startDate: { $gte: startOfWeek, $lte: endOfWeek },
  });
});

// Publish organizations with custom access control
Meteor.publish('organizations.custom', function publishOrganizationsCustom() {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Organizations.find({});
  } if (this.userId) {
    return Organizations.find({}, {
      fields: Organizations.publicFields,
    });
  }
  return Organizations.find({}, {
    fields: Organizations.limitedPublicFields,
  });

});

// Publish user profiles
Meteor.publish('UserProfilesPublication', function publishUserProfiles() {
  if (!this.userId) {
    return this.ready();
  }
  return UserProfiles.find();
});

// Publish current user profile
Meteor.publish('CurrentUserProfile', function publishCurrentUserProfile() {
  if (!this.userId) {
    return this.ready();
  }
  return UserProfiles.find({ userId: this.userId });
});

// Publish all messages relevant to the current user
Meteor.publish('userMessages', function publishUserMessages() {
  if (!this.userId) {
    return this.ready();
  }
  return Messages.find({ $or: [{ senderId: this.userId }, { receiverId: this.userId }] });
});

// Publish conversations list for the current user
Meteor.publishComposite('conversations.list', function () {
  if (!this.userId) {
    return this.ready();
  }

  return {
    find() {
      // First, find the conversations where the user is a participant
      return Conversations.find({
        participants: { $in: [this.userId] },
      });
    },
    children: [
      {
        find(conversation) {
          // Then, for each conversation, find the last message
          return Messages.find({ conversationId: conversation._id }, { sort: { createdAt: -1 }, limit: 1 });
        },
      },
      {
        find(conversation) {
          // Additionally, find the participant's user profiles for each conversation
          return UserProfiles.find({ userId: { $in: conversation.participants } });
        },
      },
    ],
  };
});

// Publish messages in a specific conversation
Meteor.publish('messages.inConversation', function publishMessagesInConversation(conversationId) {
  if (!this.userId) {
    return this.ready();
  }

  // Verify user is a participant in the conversation
  const isParticipant = Conversations.findOne({ _id: conversationId, participants: this.userId });
  if (!isParticipant) {
    return this.ready();
  }
  return Messages.find({ conversationId: conversationId });
});

Meteor.publish('allMessages', function publishAllMessages() {
  if (!this.userId) {
    return this.ready();
  }

  return Messages.find({
    $or: [
      { senderId: this.userId },
      { receiverId: this.userId },
    ],
  }, {
    fields: {
      text: 1,
      senderId: 1,
      receiverId: 1,
      createdAt: 1,
      // Ensure senderName is handled correctly as noted above
    },

  });
});
