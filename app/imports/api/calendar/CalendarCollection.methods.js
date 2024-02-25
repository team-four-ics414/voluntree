import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Calendars } from './CalendarCollection'; // Make sure this path is correct
import { Activity } from '../activities/ActivityCollection';

Meteor.methods({
  'calendar.insert'(eventData) {
    check(eventData, {
      title: String,
      description: Match.Maybe(String),
      startDate: Date,
      endDate: Date,
      allDay: Match.Maybe(Boolean),
      activityId: Match.Maybe(String),
      // Include additional fields as needed
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Validate the activityId if provided
    if (eventData.activityId) {
      const activityExists = Activity.findOne({ _id: eventData.activityId });
      if (!activityExists) {
        throw new Meteor.Error('invalid-activity', 'The specified activity does not exist.');
      }
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

    if (updateData.activityId) {
      const activityExists = Activity.findOne({ _id: updateData.activityId });
      if (!activityExists) {
        throw new Meteor.Error('invalid-activity', 'The specified activity does not exist.');
      }
    }

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

  'calendar.removeByActivityId'(activityId) {
    check(activityId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Ensure there's a link between the calendar event and the activity via activityId
    const eventsToRemove = Calendars.find({ activityId }).fetch();
    if (eventsToRemove.length === 0) {
      throw new Meteor.Error('not-found', 'No calendar events found for the specified activity.');
    }

    // Assuming each activity only has one associated calendar event for simplicity
    eventsToRemove.forEach(event => {
      // Use the correct method to remove documents from your Calendars collection
      Calendars.removeIt(event._id); // Changed from Calendars.remove to Calendars.removeIt
    });

    return { removed: true, count: eventsToRemove.length };
  },

});
