import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { MATPCollections } from '../../api/matp/MATPCollections';
import { Calendars } from '../../api/calendar/CalendarCollection';
import { Activity } from '../../api/activities/ActivityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Messages } from '../../api/messaging/MessagesCollection';
import { Conversations } from '../../api/messaging/ConversationsCollection';
import { Opportunity } from '../../api/opportunities/OpportunityCollection';
import { Causes } from '../../api/organization/CauseCollection';

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

Meteor.publish('opportunities.all', function publishOpportunitiesAll() {
  return Opportunity.find({});
});

Meteor.publish('opportunities.default', function publishDefaultOpportunities() {
  return Opportunity.find({});
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
// On the server
Meteor.publish('UserProfilesPublication', function () {
  if (!this.userId) {
    return this.ready();
  }
  return UserProfiles.find({});
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

// Publish messages in a specific conversation

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

Meteor.publish('conversations.all', function () {
  if (!this.userId) {
    return this.ready();
  }
  return Conversations.find({});
});

/*
Meteor.publish('UserProfilesPublication', function publishUserProfiles() {
  if (!this.userId) {
    return this.ready(); // Don't publish if not logged in
  }

  return UserProfiles.find({}, { fields: { firstName: 1, lastName: 1, picture: 1, email: 1, interests: 1 } });
});
*/

Meteor.publish('conversations.latestMessages', function publishConversationsWithLatestMessage() {
  if (!this.userId) {
    return this.ready();
  }

  // Fetch conversations where the current user is a participant
  const userConversations = Conversations.find({ participants: this.userId }).fetch();
  const conversationIds = userConversations.map(convo => convo._id);

  // Find the latest message for each conversation
  const latestMessages = Messages.find({ conversationId: { $in: conversationIds } }, {
    sort: { createdAt: -1 },
    limit: 1,
  }).fetch();

  // Extract unique senderIds from latest messages
  const senderIds = [...new Set(latestMessages.map(message => message.senderId))];

  // Return a cursor for each collection we need to publish
  return [
    Conversations.find({ _id: { $in: conversationIds } }),
    Messages.find({ _id: { $in: latestMessages.map(message => message._id) } }),
    UserProfiles.find({ userId: { $in: senderIds } }),
  ];
});

// eslint-disable-next-line meteor/audit-argument-checks
Meteor.publish('messages.inConversation', function (conversationId) {
  if (!this.userId) {
    return this.ready();
  }
  return Messages.find({ conversationId: conversationId });
});

// Server: Publish all users except the current user
Meteor.publish('allOtherUsers', function () {
  if (!this.userId) {
    return this.ready();
  }
  return Meteor.users.find({ _id: { $ne: this.userId } }, { fields: { profile: 1 } });
});

// eslint-disable-next-line consistent-return
Meteor.publish('conversationsWithLatestMessagesAndProfiles', async function () {
  if (!this.userId) {
    return this.ready();
  }

  const rawMessages = Messages.rawCollection();
  const aggregatePipeline = [
    {
      $match: {
        $or: [
          { senderId: this.userId },
          { receiverId: this.userId },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$conversationId',
        latestMessage: { $first: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: 'conversations',
        localField: '_id',
        foreignField: '_id',
        as: 'conversation',
      },
    },
    {
      $unwind: '$conversation',
    },
    {
      $lookup: {
        from: 'user-profiles',
        localField: 'latestMessage.senderId',
        foreignField: 'userId',
        as: 'senderProfile',
      },
    },
    {
      $unwind: '$senderProfile',
    },
    {
      $project: {
        'conversation.participants': 1,
        'latestMessage.text': 1,
        'latestMessage.senderId': 1,
        'latestMessage.receiverId': 1,
        'latestMessage.createdAt': 1,
        'senderProfile.firstName': 1,
        'senderProfile.lastName': 1,
        'senderProfile.picture': 1,
      },
    },
    {
      $match: {
        'conversation.participants': this.userId,
      },
    },
    // Define your aggregation pipeline here
  ];

  try {
    const result = await rawMessages.aggregate(aggregatePipeline).toArray();

    result.forEach((doc) => {
      this.added('messages', doc._id, doc);
    });

    this.ready();
  } catch (error) {
    console.error('Aggregation error:', error);
    this.ready(); // Ensure this.ready() is called even in the catch block.
  }
});

Meteor.publish('conversations.list', function () {
  if (!this.userId) {
    return this.ready();
  }

  const conversations = Conversations.find({ participants: this.userId });
  const conversationIds = conversations.fetch().map(convo => convo._id);

  // Fetch latest message for each conversation
  const latestMessages = conversationIds.map(conversationId => Messages.findOne({ conversationId: conversationId }, { sort: { createdAt: -1 } })).filter(Boolean); // Filter out any undefined results if a conversation has no messages

  const latestMessageIds = latestMessages.map(message => message._id);

  return [
    conversations,
    Messages.find({ _id: { $in: latestMessageIds } }),
  ];
});

Meteor.publish('organizations.search', function (searchTerm) {
  if (!this.userId) { // Optionally restrict this to logged-in users.
    return this.ready();
  }

  const regex = new RegExp(searchTerm, 'i'); // Case insensitive regex search.
  return Organizations.find({ name: { $regex: regex } }, { limit: 10 }); // Limit results and adjust fields as needed.
});

Meteor.publish('Organizations', function () {
  return Organizations.find();
});

Meteor.publish('Causes', function publishCauses() {
  return Causes.find(); // This publishes all causes
});

Meteor.publish('Organizations', function publishOrganizations() {
  return Organizations.find(); // Adjust the query as needed based on your application's security and business logic requirements
});
