import { Meteor } from 'meteor/meteor';
import { MATPCollections } from '../../api/matp/MATPCollections';
import { Organizations } from '../../api/organization/Organization';
import { Events } from '../../api/calendar/EventCollection';

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

Meteor.publish(Organizations.userPublicationName, function () {
  if (this.userId) {
    return Organizations.collection.find();
  }
  return this.ready();
});

Meteor.publish('events', function publishEvents() {
  return Events.find();
});
