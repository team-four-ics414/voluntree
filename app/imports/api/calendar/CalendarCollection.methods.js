import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Calendars } from './CalendarCollection';
import { ROLE } from '../role/Role';

Meteor.methods({
  'Calendars.insert'(calendarData) {
    // Update check to include new fields
    check(calendarData, {
      name: String,
      description: String,
      ownerId: String,
      startTime: Date,
      endTime: Date,
    });

    if (!this.userId || !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to perform this action.');
    }

    return Calendars.define(calendarData);
  },
  'Calendars.update'(calendarId, calendarData) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    check(calendarId, String);
    check(calendarData, Object); // Consider validating specific fields if necessary
    Calendars.update(calendarId, calendarData);
  },
  'Calendars.remove'(calendarId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    check(calendarId, String);
    Calendars.remove(calendarId);
  },
});
