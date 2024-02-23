import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Calendar } from '/imports/api/calendar/CalendarCollection';

Meteor.methods({
  'calendar.insert'(eventData) {
    check(eventData, {
      eventDate: Date,
      title: String,
      description: Match.Maybe(String),
      location: Match.Maybe(String),
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be signed in to add a new event.');
    }

    const eventId = Calendar.define({
      ...eventData,
      createdAt: new Date(),
      owner: this.userId,
    });

    return eventId;
  },

  'calendar.update'(eventId, updateData) {
    check(eventId, String);
    check(updateData, {
      eventDate: Match.Maybe(Date),
      title: Match.Maybe(String),
      description: Match.Maybe(String),
      location: Match.Maybe(String),
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be signed in to update an event.');
    }

    // Optional: Check if the user is the owner of the event or has permission to update it

    Calendar.update(eventId, {
      $set: {
        ...updateData,
        // updatedAt: new Date(), // Consider adding an updatedAt field
      },
    });

    return eventId; // Optionally return some value or confirmation
  },

  'calendar.remove'(eventId) {
    check(eventId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be signed in to remove an event.');
    }

    // Optional: Check if the user is the owner of the event or has permission to remove it

    Calendar.removeIt(eventId);

    return eventId; // Optionally return some value or confirmation
  },

  // You can add more methods (e.g., for publishing or subscribing) following similar patterns
});
