import { Meteor } from 'meteor/meteor';
import { MATPCollections } from '../../api/matp/MATPCollections';
import { Calendars } from '../../api/calendar/CalendarCollection';

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
