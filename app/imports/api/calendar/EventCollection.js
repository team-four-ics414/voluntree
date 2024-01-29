import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import Calendars from './CalendarCollection';

class EventCollection extends BaseCollection {
  constructor() {
    super('Events', new SimpleSchema({
      title: String,
      description: {
        type: String,
        optional: true,
      },
      startTime: Date,
      endTime: Date,
      location: String,
      calendarId: String,
      createdAt: {
        type: Date,
        defaultValue: new Date(),
      },
      nonprofitId: {
        type: String,
        optional: true,
      },
      activityDetails: {
        type: String,
        optional: true,
      },
      frequency: {
        type: String,
        optional: true,
      },
      commitmentRequired: {
        type: Boolean,
        optional: true,
        defaultValue: false,
      },
      skillsRequired: {
        type: Array,
        optional: true,
      },
      'skillsRequired.$': String,
      accessibilityInfo: {
        type: String,
        optional: true,
      },
      requirements: {
        type: Object,
        optional: true,
      },
      'requirements.backgroundCheck': {
        type: Boolean,
        optional: true,
        defaultValue: false,
      },
      'requirements.ageRange': {
        type: String,
        optional: true,
      },
      impact: {
        type: String,
        optional: true,
      },
      volunteerValueEstimate: {
        type: Number,
        optional: true,
      },
      isOpenForRegistration: {
        type: Boolean,
        defaultValue: true,
      },
      isVirtual: {
        type: Boolean,
        defaultValue: false,
      },
      maxParticipants: {
        type: SimpleSchema.Integer,
        optional: true,
      },
      // Additional fields that might be relevant
      targetAudience: {
        type: String,
        optional: true,
      },
      hostedBy: {
        type: String,
        optional: true,
      },
      // Cloudinary image URL integration here
      eventImageUrl: {
        type: String,
        optional: true,
      },
      tags: {
        type: Array,
        optional: true,
      },
      'tags.$': String,
    }));
  }

  // Additional methods for event management can be added here

  // Method to get count
  getCount() {
    return this._collection.find().count();
  }

  /**
   * Check if the provided calendar ID is valid.
   * @param calendarId The ID of the calendar to validate.
   * @returns {boolean} True if the calendar exists, false otherwise.
   */
  isValidCalendar(calendarId) {
    return !!Calendars.findOne({ _id: calendarId });
  }

  /**
   * Defines a new event and updates the corresponding calendar.
   * @param eventData An object representing the event.
   * @returns The _id of the new document.
   */
  define(eventData) {
    if (!this.isValidCalendar(eventData.calendarId)) {
      throw new Meteor.Error('invalid-calendar', 'The provided calendar ID does not exist.');
    }

    // Insert the event
    let eventId;
    try {
      eventId = this._collection.insert(eventData);
    } catch (error) {
      throw new Meteor.Error('insert-failed', error.message);
    }

    // Update the calendar with the new event
    try {
      Calendars.update(eventData.calendarId, { $push: { events: eventId } });
    } catch (error) {
      throw new Meteor.Error('calendar-update-failed', error.message);
    }

    return eventId;
  }
}

export const Events = new EventCollection();
