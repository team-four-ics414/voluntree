import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check, Match } from 'meteor/check';
import { Events } from './EventCollection'; // Adjust the import path as necessary

Meteor.methods({
  'Events.insert'(eventData) {
    check(eventData, {
      title: String,
      startTime: Date,
      end: Date,
      endTime: Match.Optional(Date), // Corrected to match the schema
      description: Match.Optional(String), // Match.Optional if it's not required
      location: Match.Maybe(String),
      isVirtual: Match.Maybe(Boolean),
      hostedBy: Match.Maybe(String),
      maxParticipants: Match.Maybe(SimpleSchema.Integer),
      isOpenForRegistration: Match.Maybe(Boolean),
      tags: Match.Maybe([String]),
    });

    return Events.define(eventData);
  },

  'Events.update'(eventId, updateData) {
    check(eventId, String);
    check(updateData, Object); // For simplicity, checking updateData as Object. Define a more specific schema as needed.

    // Use the `update` method of EventCollection for updating an event
    return Events.update(eventId, { $set: updateData });
  },

  'Events.remove'(eventId) {
    check(eventId, String);

    // Use the `remove` method of EventCollection to remove an event
    return Events.remove(eventId);
  },

  'Events.findById'(eventId) {
    check(eventId, String);

    // Use the `findById` method of EventCollection to find an event by its ID
    return Events.findById(eventId);
  },

  'Events.findByTags'(tags) {
    check(tags, [String]);

    // Use the custom method for finding events by tags
    return Events.findByTags(tags);
  },
});
