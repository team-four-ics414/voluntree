import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { MATPCollections } from '../../api/matp/MATPCollections';
import { Calendars } from '../../api/calendar/CalendarCollection';
import { Activity } from '../../api/activities/ActivityCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Messages } from '../../api/messaging/MessagesCollection';

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

Meteor.publish('calendar.all', function publishAll() {
  return Calendars.find({}); // Make sure Calendars is the instance of your collection
});

Meteor.publish('recentActivities.public', function publishRecentActivities() {
  // No user authentication check here
  return Activity.find({}, { sort: { createdAt: -1 }, limit: 3 });
});

Meteor.publish('calendar.thisWeek', function () {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Adjust to your week start (e.g., Sunday or Monday)
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return Calendars.find({
    startDate: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  });
});

Meteor.publish('organizations.custom', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    // Admin users get all data
    return Organizations.find({});
  } if (this.userId) {
    // Logged-in but non-admin users get all except 'createdAt' and 'createdBy'
    return Organizations.find({}, {
      fields: {
        name: 1,
        type: 1,
        missionStatement: 1,
        contactEmail: 1,
        website: 1,
        description: 1,
        email: 1,
        phoneNumber: 1,
        address: 1,
        // 'createdAt' and 'createdBy' are excluded for non-admins
      },
    });
  }
  // Non-logged-in users get limited fields
  return Organizations.find({}, {
    fields: {
      name: 1,
      type: 1,
      missionStatement: 1,
      email: 1,
      website: 1,
      phoneNumber: 1,
      address: 1,
    },
  });
});

Meteor.publish('UserProfilesPublication', function publish() {
  if (this.userId) {
    return UserProfiles.find();
  }
  return this.ready();
});

Meteor.publish('CurrentUserProfile', function () {
  if (!this.userId) {
    return this.ready();
  }

  return UserProfiles.find({ userId: this.userId });
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

Meteor.publish('userName', function publishUserName() {
  if (!this.userId) {
    return this.ready();
  }
  return UserProfiles.publishUserName();
});
