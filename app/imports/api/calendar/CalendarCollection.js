import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class CalendarCollection extends BaseCollection {
  constructor() {
    super('Calendars', new SimpleSchema({
      name: {
        type: String,
        optional: false,
      },
      description: {
        type: String,
        optional: true,
      },
      // Additional fields specific to a calendar can be added here
      createdAt: {
        type: Date,
        defaultValue: new Date(),
      },
      ownerId: {
        type: String,
        optional: false, // Assuming every calendar has an owner
      },
      // Other fields like 'color', 'visibility', etc. can be added as per your requirements
    }));
  }

  // Additional methods for calendar management can be added here

  /**
   * Defines a new calendar.
   * @param calendarData An object representing the calendar.
   * @returns The _id of the new document.
   */
  define(calendarData) {
    // You can add additional validation or logic here if needed
    return this._collection.insert(calendarData);
  }
}

export const Calendars = new CalendarCollection();
