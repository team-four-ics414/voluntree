import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const pendingPublications = {
  pending: 'PendingCollection',
};

class PendingCollection extends BaseCollection {
  constructor() {
    super('Pending', new SimpleSchema({
      activityID: String,
      activityName: String,
      organizationID: String,
      comment: String,
      owner: String,
    }));
  }

  define({ activityID, activityName, organizationID, comment, owner }) {
    const docID = this._collection.insert({
      activityID,
      activityName,
      organizationID,
      comment,
      owner,
    });
    return docID;
  }

  update(docID, { activityID, activityName, organizationID, comment, owner }) {
    const updateData = {};
    if (activityID) {
      updateData.activityID = activityID;
    }
    if (activityName) {
      updateData.activityName = activityName;
    }
    if (organizationID) {
      updateData.organizationID = organizationID;
    }
    if (comment) {
      updateData.comment = comment;
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
      Meteor.publish(pendingPublications.pending, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribePending() {
    if (Meteor.isClient) {
      return Meteor.subscribe(pendingPublications.pending);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const activityID = doc.activityID;
    const activityName = doc.activityName;
    const organizationID = doc.activityID;
    const comment = doc.comment;
    const owner = doc.owner;
    return { activityID, activityName, organizationID, comment, owner };
  }
}

export const Pending = new PendingCollection();
