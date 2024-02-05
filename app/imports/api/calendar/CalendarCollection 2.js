import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class CalendarCollection extends BaseCollection {
  constructor() {
    const calendarSchema = new SimpleSchema({
      name: String,
      description: { type: String, optional: true },
      createdAt: { type: Date, defaultValue: new Date() },
      ownerId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
      // Add other fields as necessary
    });

    super('Calendars', calendarSchema);
  }

  /**
   * Defines a new calendar.
   * @param {Object} calendarData - The data for the new calendar.
   * @returns {String} The ID of the newly created calendar document.
   */
  define(calendarData) {
    // Insert the new calendar
    return this._collection.insert(calendarData);
  }
}

export const Calendars = new CalendarCollection();
