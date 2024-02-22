import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

// Define the schema for an event
const EventSchema = new SimpleSchema({
  title: String,
  startTime: Date,
  endTime: {
    type: Date,
    optional: true, // Assuming endTime might be optional
  },
  description: {
    type: String,
    optional: true,
  },
  location: {
    type: String,
    optional: true,
  },
  isVirtual: {
    type: Boolean,
    optional: true,
  },
  hostedBy: {
    type: String,
    optional: true,
  },
  maxParticipants: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  isOpenForRegistration: {
    type: Boolean,
    optional: true,
  },
  tags: {
    type: Array,
    optional: true,
  },
  'tags.$': String,
});

class EventCollection extends BaseCollection {
  constructor() {
    super('Events', EventSchema);
  }

  // Define an event
  define({ title, startTime, endTime, ...rest }) {
    const docID = this._collection.insert({ title, startTime, endTime, ...rest });
    return docID;
  }

  // Update an event
  update(selector, modifier) {
    return this._collection.update(selector, { $set: modifier });
  }

  // Remove an event
  remove(selector) {
    return this._collection.remove(selector);
  }

  // Find an event by ID
  findById(id) {
    return this._collection.findOne(id);
  }

  // Find events based on a query and options
  find(selector, options) {
    return this._collection.find(selector, options).fetch();
  }

  // Find a single event based on a query and options
  findOne(selector, options) {
    return this._collection.findOne(selector, options);
  }

  // Additional helper methods for the collection can be placed here

  // Example: Find events by tags
  findByTags(tags) {
    return this.find({ tags: { $in: tags } });
  }

  // Example: Count events based on a specific condition
  countByCondition(condition) {
    return this._collection.find(condition).count();
  }
}

export const Events = new EventCollection();
