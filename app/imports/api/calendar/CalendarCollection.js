import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

class CalendarCollection extends BaseCollection {
  constructor() {
    const calendarSchema = new SimpleSchema({
      name: String,
      description: { type: String, optional: true },
      createdAt: {
        type: Date,
        autoValue() {
          if (this.isInsert) {
            return new Date();
          } else if (this.isUpsert) {
            return { $setOnInsert: new Date() };
          }
          this.unset(); // Prevent user from supplying their own value
        },
      },
      ownerId: {
        type: String,
        regEx: objectIdPattern,
      },
      // Add startTime and endTime to the schema
      startTime: Date,
      endTime: Date,
    });
    super('Calendars', calendarSchema);
  }

  define(calendarData) {
    // Additional validation or checks can be performed here
    return this._collection.insert(calendarData);
  }

  update(calendarId, calendarData) {
    check(calendarId, String);
    this._schema.validate(calendarData, { keys: Object.keys(calendarData) });
    return this._collection.update(calendarId, { $set: calendarData });
  }

  remove(calendarId) {
    check(calendarId, String);
    return this._collection.remove(calendarId);
  }

  findAll() {
    return this._collection.find().fetch();
  }

  findById(calendarId) {
    check(calendarId, String);
    return this._collection.findOne(calendarId);
  }

  findByOwner(ownerId) {
    check(ownerId, String);
    return this._collection.find({ ownerId }).fetch();
  }
}

export const Calendars = new CalendarCollection();
