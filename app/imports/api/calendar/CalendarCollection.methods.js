import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Calendars } from './CalendarCollection'; // Ensure this path is correct
import { Activity } from '../activities/ActivityCollection';

Meteor.methods({
  /**
   * Inserts a new event into the Calendars collection.
   *
   * @param {Object} eventData - The data for the new event.
   * @param {string} eventData.title - The title of the event.
   * @param {string} [eventData.description] - The description of the event.
   * @param {Date} eventData.startDate - The start date and time of the event.
   * @param {Date} eventData.endDate - The end date and time of the event.
   * @param {boolean} [eventData.allDay] - Flag indicating if the event lasts all day.
   * @param {string} [eventData.activityId] - Optional ID of an associated activity.
   * @returns {string} The ID of the newly inserted event.
   * @throws {Meteor.Error} if the user is not authorized or if the activity does not exist.
   */
  // eslint-disable-next-line meteor/audit-argument-checks
  'calendar.insert'(eventData) {
    try {
      check(eventData, Match.Where(data => {
        check(data, {
          title: String,
          description: Match.Maybe(String),
          startDate: Date,
          endDate: Date,
          allDay: Match.Maybe(Boolean),
          activityId: Match.Maybe(String),
        });

        if (data.startDate > data.endDate) {
          throw new Meteor.Error('invalid-dates', 'Start date must be before end date.');
        }

        return true;
      }));

      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
      }

      if (eventData.activityId) {
        const activityExists = Activity.findOne({ _id: eventData.activityId });
        if (!activityExists) {
          throw new Meteor.Error('invalid-activity', 'The specified activity does not exist.');
        }
      }

      const eventId = Calendars.define({
        ...eventData,
        owner: this.userId,
      });

      return eventId;
    } catch (error) {
      throw new Meteor.Error('insert-failed', error.message);
    }
  },

  /**
   * Updates an existing calendar event by its ID.
   *
   * @param {string} eventId - The ID of the event to update.
   * @param {Object} updateData - The data to update the event with.
   * @returns {string} The ID of the updated event.
   * @throws {Meteor.Error} if the user is not authorized or if the activity does not exist.
   */
  // eslint-disable-next-line meteor/audit-argument-checks
  'calendar.update'(eventId, updateData) {
    try {
      check(eventId, String);
      check(updateData, {
        title: Match.Optional(String),
        description: Match.Optional(String),
        startDate: Match.Optional(Date),
        endDate: Match.Optional(Date),
        allDay: Match.Optional(Boolean),
        activityId: Match.Optional(String),
      });

      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
      }

      if (updateData.activityId) {
        const activityExists = Activity.findOne({ _id: updateData.activityId });
        if (!activityExists) {
          throw new Meteor.Error('invalid-activity', 'The specified activity does not exist.');
        }
      }

      Calendars.update(eventId, { $set: updateData });

      return eventId;
    } catch (error) {
      throw new Meteor.Error('update-failed', error.message);
    }
  },

  /**
   * Removes a calendar event by its ID.
   *
   * @param {string} eventId - The ID of the event to remove.
   * @returns {string} The ID of the removed event.
   * @throws {Meteor.Error} if the user is not authorized.
   */
  // eslint-disable-next-line meteor/audit-argument-checks
  'calendar.remove'(eventId) {
    try {
      check(eventId, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
      }

      Calendars.removeIt(eventId); // Ensure this is the correct method to remove documents in your collection

      return eventId;
    } catch (error) {
      throw new Meteor.Error('remove-failed', error.message);
    }
  },

  /**
   * Removes all calendar events associated with a given activity ID.
   *
   * @param {string} activityId - The ID of the activity whose events are to be removed.
   * @returns {Object} An object containing the removal status and count of removed events.
   * @throws {Meteor.Error} if the user is not authorized or if no events are found.
   */
  // eslint-disable-next-line meteor/audit-argument-checks
  'calendar.removeByActivityId'(activityId) {
    try {
      check(activityId, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
      }

      const eventsToRemove = Calendars.find({ activityId }).fetch();
      if (eventsToRemove.length === 0) {
        throw new Meteor.Error('not-found', 'No calendar events found for the specified activity.');
      }

      eventsToRemove.forEach(event => Calendars.removeIt(event._id));

      return { removed: true, count: eventsToRemove.length };
    } catch (error) {
      throw new Meteor.Error('removeByActivityId-failed', error.message);
    }
  },

  /**
   * Finds and returns the upcoming three events from today onwards.
   *
   * @returns {Array} An array of the upcoming three events sorted by start date.
   */
  'calendar.findUpcomingThreeEvents'() {
    // This method does not strictly require authorization checks, adjust as needed
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Calendars.find({
      startDate: { $gte: today },
    }, {
      sort: { startDate: 1 },
      limit: 3,
    }).fetch();
  },

  /**
   * Checks if a calendar event exists for a given activity ID.
   *
   * @param {string} activityId - The ID of the activity to check for an associated event.
   * @returns {boolean} True if an event exists for the given activity ID, false otherwise.
   * @throws {Meteor.Error} if the user is not authorized.
   */
  // eslint-disable-next-line meteor/audit-argument-checks
  'calendar.checkExists'(activityId) {
    try {
      check(activityId, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
      }

      return !!Calendars.findOne({ activityId });
    } catch (error) {
      throw new Meteor.Error('checkExists-failed', error.message);
    }
  },
});
