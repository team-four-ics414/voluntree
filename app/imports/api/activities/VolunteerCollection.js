import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const volunteerPublications = {
  volunteer: 'VolunteerCollection',
};

class VolunteerCollection extends BaseCollection {
  constructor() {
    super('Volunteer', new SimpleSchema({
      activityID: String,
      participant: {
        type: Array,
      },
      'participant.$': String,
      owner: String,
    }));
  }

  define({ activityID, participant, owner }) {
    const docID = this._collection.insert({
      activityID,
      participant,
      owner,
    });
    return docID;
  }

  update(docID, { activityID, participant, owner }) {
    const updateData = {};
    if (activityID) {
      updateData.activityID = activityID;
    }
    if (participant) {
      updateData.participant = participant;
    }
    if (owner) {
      updateData.owner = owner;
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
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(volunteerPublications.volunteer, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeVolunteer() {
    if (Meteor.isClient) {
      return Meteor.subscribe(volunteerPublications.volunteer);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const activityID = doc.activityID;
    const participant = doc.participant;
    const owner = doc.owner;
    return { activityID, participant, owner };
  }
}

export const Volunteer = new VolunteerCollection();
