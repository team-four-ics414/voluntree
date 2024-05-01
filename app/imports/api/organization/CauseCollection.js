import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { ROLE } from '../role/Role';
import BaseCollection from '../base/BaseCollection';

class CauseCollection extends BaseCollection {
  constructor() {
    super('Causes', new SimpleSchema({
      name: String,
      icon: String, // URL or path to the icon image
    }));
  }

  /**
   * Defines a new Cause.
   * @param {Object} cause The cause to add, with `name` and `icon`.
   * @return {String} the docID of the new document.
   */
  define({ name, icon }) {
    const docID = this._collection.insert({ name, icon });
    return docID;
  }

  /**
   * Updates the given document.
   * @param {String} docID the id of the document to update.
   * @param {Object} updateData an object with `name` and/or `icon` properties to update.
   */
  update(docID, updateData) {
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes a cause.
   * @param {String} docID the id of the document to remove.
   * @returns {boolean} true if the operation was successful.
   */
  removeIt(docID) {
    this._collection.remove(docID);
    return true;
  }

  /**
   * Publishes the causes.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish('Causes', function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscribes to the causes.
   */
  subscribeCauses() {
    if (Meteor.isClient) {
      return Meteor.subscribe('Causes');
    }
    return null;
  }

  /**
   * Asserts that the user has the correct role to perform methods.
   * @param {String} userId the user's ID.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Helper to dump cause data.
   * @param {String} docID the document ID to dump.
   * @returns {Object} an object with cause details.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    return { name: doc.name, icon: doc.icon };
  }
}

export const Causes = new CauseCollection();
