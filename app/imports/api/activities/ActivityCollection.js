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
      time: String,
      name: String,
      details: String,
      createdAt: Date,
      benefits: String,
      location: String,
      frequency: String,
      requirement: String,
      contactInfo: String,
      image: { type: String, optional: true },
      owner: String,
    }));
  }

  define({ time, name, details, createdAt, benefits, location, frequency, requirement, contactInfo, image, owner }) {
    const docID = this._collection.insert({
      time,
      name,
      details,
      createdAt,
      benefits,
      location,
      frequency,
      requirement,
      contactInfo,
      image,
      owner,
    });
    return docID;
  }

  update(docID, { time, name, details, createdAt, benefits, location, frequency, requirement, contactInfo, image, owner }) {
    const updateData = {};
    if (time) {
      updateData.time = time;
    }
    if (name) {
      updateData.name = name;
    }
    if (details) {
      updateData.details = details;
    }
    if (createdAt) {
      updateData.details = createdAt;
    }
    if (benefits) {
      updateData.benefits = benefits;
    }
    if (location) {
      updateData.location = location;
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
    if (contactInfo) {
      updateData.owner = owner;
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
    const time = doc.time;
    const name = doc.name;
    const details = doc.details;
    const createdAt = doc.createdAt;
    const benefits = doc.benefits;
    const location = doc.location;
    const frequency = doc.frequency;
    const requirement = doc.requirement;
    const contactInfo = doc.contactInfo;
    const image = doc.details;
    const owner = doc.owner;
    return { time, name, details, createdAt, benefits, location, frequency, requirement, contactInfo, image, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Activity = new ActivityCollection();