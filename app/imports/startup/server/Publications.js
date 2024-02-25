import { Meteor } from 'meteor/meteor';
import { MATPCollections } from '../../api/matp/MATPCollections';
import { Calendars } from '../../api/calendar/CalendarCollection';
import { Activity } from '../../api/activities/ActivityCollection';

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
