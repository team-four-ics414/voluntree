import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

// Define the schema for a calendar event
const CalendarEventSchema = new SimpleSchema({
  title: String,
  description: {
    type: String,
    optional: true,
  },
  startDate: Date,
  endDate: Date,
  allDay: {
    type: Boolean,
    optional: true,
  },
  activityId: {
    type: String,
    optional: true, // Make optional if not all calendar events are linked to an activity
  },
  // Extend with more fields as needed
});

class CalendarCollection extends BaseCollection {
  constructor() {
    super('Calendar', CalendarEventSchema);
  }

  /**
   * Defines a new Calendar event.
   * @param {Object} eventDetails - The details of the event.
   * @returns {String} The docID of the created document.
   */
  define(eventDetails) {
    // Implement additional validation or preprocessing as needed
    const docId = this._collection.insert(eventDetails);
    return docId;
  }

  /**
   * Updates an existing Calendar event.
   * @param docId {String} - The ID of the document to update.
   * @param {Object} updateData - The data to update the document with.
   */
  update(docId, updateData) {
    const updateCount = this._collection.update(docId, { $set: updateData });
    return updateCount;
  }

  removeIt(docId) {
    const removeCount = this._collection.remove(docId);
    return removeCount;
  }
  // Implement additional methods as necessary, following the patterns established in BaseCollection
}

export const Calendars = new CalendarCollection();
