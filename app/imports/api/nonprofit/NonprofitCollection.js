import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import BaseCollection from '../base/BaseCollection';
import DBSchemaNonprofit from '../schema/DBSchemas';
import { ROLE } from '../role/Role';

export const nonprofitTypes = ['Business', 'Organization', 'Individual'];
export const nonprofitPublications = {
  nonprofit: 'Nonprofit',
  nonprofitAdmin: 'NonprofitAdmin',
};

class NonprofitCollection extends BaseCollection {
  constructor() {
    super('Stuffs', DBSchemaNonprofit);
  }

  /**
   * Defines a new Nonprofit.
   * @param name the name of the item.
   * @param quantity how many.
   * @param owner the owner of the item.
   * @param condition the condition of the item.
   * @return {String} the docID of the new document.
   */
  define({ type, name, mission, contactInfo, location, createdAt, picture, owner }) {
    const docID = this._collection.insert({
      type,
      name,
      mission,
      contactInfo,
      location,
      createdAt,
      picture,
      owner,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param quantity the new quantity (optional).
   * @param condition the new condition (optional).
   */
  update(docID, { type, name, mission, contactInfo, location, picture }) {
    const updateData = {};
    if (type) {
      updateData.type = type;
    }
    if (name) {
      updateData.name = name;
    }
    if (mission) {
      updateData.mission = name;
    }
    if (contactInfo) {
      updateData.contactInfo = name;
    }
    if (location) {
      updateData.location = name;
    }
    if (picture) {
      updateData.picture = name;
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
   * It publishes the entire collection for admin and just the nonprofit associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the StuffCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(nonprofitPublications.nonprofit, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
      Meteor.publish(nonprofitPublications.nonprofitAdmin, function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, ROLE.ADMIN)) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeNonprofit() {
    if (Meteor.isClient) {
      return Meteor.subscribe(nonprofitPublications.nonprofit);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeNonprofitAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(nonprofitPublications.nonprofitAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
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
    const type = doc.type;
    const name = doc.name;
    const mission = doc.mission;
    const contactInfo = doc.contactInfo;
    const location = doc.location;
    const createdAt = doc.createdAt;
    const picture = doc.picture;
    const owner = doc.owner;
    return { type, name, mission, contactInfo, location, createdAt, picture, owner };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Nonprofits = new NonprofitCollection();
