import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Calendars } from '/imports/api/calendar/CalendarCollection'; // Make sure this path is correct

Meteor.methods({
  'calendar.insert'(eventData) {
    check(eventData, {
      title: String,
      description: Match.Maybe(String),
      startDate: Date,
      endDate: Date,
      allDay: Match.Maybe(Boolean),
      // Include additional fields as needed
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const eventId = Calendars.define({
      ...eventData,
      createdAt: new Date(),
      owner: this.userId,
    });

    return eventId;
  },

  'calendar.update'(eventId, updateData) {
    check(eventId, String);
    check(updateData, Object); // For simplicity, checking for an object, refine as needed

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Additional ownership or permission checks as needed

    Calendars.update(eventId, updateData);

    return eventId;
  },

  'calendar.remove'(eventId) {
    check(eventId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Additional ownership or permission checks as needed

    Calendars.removeIt(eventId);

    return eventId;
  },
});
