import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class EventCollection extends BaseCollection {
  constructor() {
    super('Events', new SimpleSchema({
      title: { type: String },
      description: { type: String, optional: true },
      startTime: { type: Date },
      endTime: { type: Date },
      location: { type: String, optional: true }, // Optional for virtual events
      calendarId: { type: String }, // Link to a specific calendar
      createdAt: { type: Date, defaultValue: new Date() },
      isVirtual: { type: Boolean, defaultValue: false }, // Differentiate between virtual and in-person
      hostedBy: { type: String, optional: true }, // Entity hosting the event
      maxParticipants: { type: SimpleSchema.Integer, optional: true }, // Maximum number of participants
      isOpenForRegistration: { type: Boolean, defaultValue: true }, // If the event is open for registration
      tags: { type: Array, optional: true }, // Tags for categorization
      'tags.$': { type: String },
    }));
  }

  define(eventData) {
    // Ensure the calendarId exists or any other validations as per your requirements
    const docId = this._collection.insert(eventData);
    return docId;
  }

  getCount() {
    return this._collection.find().count();
  }
}

export const Events = new EventCollection();
