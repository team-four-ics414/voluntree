import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityPublications = {
  opportunity: 'OpportunityCollection',
};

class OpportunityCollection extends BaseCollection {
  constructor() {
    super('Opportunity', new SimpleSchema({
      name: String,
      image: String,
      description: String,
      category: String,
      location: String,
      time: String,
      frequency: String,
    }));

    // Define default opportunities

    // Check if the collection is empty

  }

  define({ name, image, description, category, location, time, frequency }) {
    const docID = this._collection.insert({
      name,
      image,
      description,
      category,
      location,
      time,
      frequency,
    });
    return docID;
  }

  update(docID, { name, image, description, category, location, time, frequency }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (image) {
      updateData.image = image;
    }
    if (description) {
      updateData.description = description;
    }
    if (category) {
      updateData.category = category;
    }
    if (location) {
      updateData.location = location;
    }
    if (time) {
      updateData.time = time;
    }
    if (frequency) {
      updateData.frequency = frequency;
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(opportunityPublications.opportunity, function publish() {
        return instance._collection.find();
      });
    }
  }

  subscribeOpportunity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunity);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const image = doc.image;
    const description = doc.description;
    const category = doc.category;
    const location = doc.location;
    const time = doc.time;
    const frequency = doc.frequency;
    return { name, image, description, category, location, time, frequency };
  }

}

export const Opportunity = new OpportunityCollection();
