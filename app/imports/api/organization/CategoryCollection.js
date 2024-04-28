import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { ROLE } from '../role/Role';
import BaseCollection from '../base/BaseCollection';

class CategoryCollection extends BaseCollection {
  constructor() {
    super('Categories', new SimpleSchema({
      name: String,
      icon: String, // URL or path to the icon image
    }));
  }

  /**
   * Defines a new Category.
   * @param {Object} category The category to add, with `name` and `icon`.
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
   * Removes a category.
   * @param {String} docID the id of the document to remove.
   * @returns {boolean} true if the operation was successful.
   */
  removeIt(docID) {
    this._collection.remove(docID);
    return true;
  }

  /**
   * Publishes the categories.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish('Categories', function publish() {
        if (this.userId && Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscribes to the categories.
   */
  subscribeCategories() {
    if (Meteor.isClient) {
      return Meteor.subscribe('Categories');
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
   * Helper to dump category data.
   * @param {String} docID the document ID to dump.
   * @returns {Object} an object with category details.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    return { name: doc.name, icon: doc.icon };
  }
}

export const Categories = new CategoryCollection();
