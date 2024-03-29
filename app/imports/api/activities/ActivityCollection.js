import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const activityPublications = {
  activity: 'ActivityCollection',
};

class ActivityCollection extends BaseCollection {
  constructor() {
    super('Activity', new SimpleSchema({
      startTime: Date,
      endTime: {
        type: Date,
        optional: true, // Assuming endTime might be optional
      },
      name: String,
      details: String,
      createdAt: Date,
      benefits: String,
      location: {
        type: Object,
        optional: true,
      },
      'location.lat': {
        type: Number,
        min: -90,
        max: 90,
      },
      'location.lng': {
        type: Number,
        min: -180,
        max: 180,
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
      frequency: String,
      requirement: String,
      contactInfo: String, // What contactInfo are we using?
      image: { type: String, optional: true },
      owner: String,
      calendarId: {
        type: String,
        optional: true, // Make optional if not all calendar events are linked to an activity
      },
    }));
  }

  define({ startTime, endTime, name, details, createdAt, benefits, location, isOpenForRegistration, tags, frequency, requirement, contactInfo, image, owner, calendarId }) {
    const docID = this._collection.insert({
      startTime,
      endTime,
      name,
      details,
      createdAt,
      benefits,
      location,
      isOpenForRegistration,
      tags,
      frequency,
      requirement,
      contactInfo,
      image,
      owner,
      calendarId,
    });
    return docID;
  }

  update(docID, { startTime, endTime, name, details, createdAt, benefits, location, isOpenForRegistration, tags, frequency, requirement, contactInfo, image, owner, calendarId }) {
    const updateData = {};
    if (startTime) {
      updateData.startTime = startTime;
    }
    if (endTime) {
      updateData.endTime = endTime;
    }
    if (name) {
      updateData.name = name;
    }
    if (details) {
      updateData.details = details;
    }
    if (createdAt) {
      updateData.createdAt = createdAt;
    }
    if (benefits) {
      updateData.benefits = benefits;
    }
    if (location) {
      updateData.location = location;
    }
    if (isOpenForRegistration) {
      updateData.isOpenForRegistration = isOpenForRegistration;
    }
    if (tags) {
      updateData.tags = tags;
    }
    if (frequency) {
      updateData.frequency = frequency;
    }
    if (requirement) {
      updateData.requirement = requirement;
    }
    if (contactInfo) {
      updateData.contactInfo = contactInfo;
    }
    if (image) {
      updateData.image = image;
    }
    if (owner) {
      updateData.owner = owner;
    }
    if (calendarId) {
      updateData.calendarId = calendarId;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(activityPublications.activity, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeActivity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(activityPublications.activity);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const startTime = doc.startTime;
    const endTime = doc.endTime;
    const name = doc.name;
    const details = doc.details;
    const createdAt = doc.createdAt;
    const benefits = doc.benefits;
    const location = doc.location;
    const isOpenForRegistration = doc.location;
    const tags = doc.tags;
    const frequency = doc.frequency;
    const requirement = doc.requirement;
    const contactInfo = doc.contactInfo;
    const image = doc.image;
    const owner = doc.owner;
    const calendarId = doc.calendarId;
    return { startTime, endTime, name, details, createdAt, benefits, location, isOpenForRegistration, tags, frequency, requirement, contactInfo, image, owner, calendarId };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Activity = new ActivityCollection();
