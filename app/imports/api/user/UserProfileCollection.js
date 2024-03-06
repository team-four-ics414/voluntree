import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import BaseProfileCollection from './BaseProfileCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

class UserProfileCollection extends BaseProfileCollection {
  constructor() {
    super('UserProfile', new SimpleSchema({
      picture: { type: String, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      // add more user profile fields here
    }));
  }

  /**
   * Defines the profile associated with an User and the associated Meteor account.
   * @param email The email associated with this profile. Will be the username.
   * @param password The password for this user.
   * @param firstName The first name.
   * @param lastName The last name.
   */
  define({ email, firstName, lastName, password, picture = '', interests = [] }) {
    // Ensure operation only runs on the server to prevent client-side security issues.
    if (Meteor.isServer) {
      const username = email;
      // Check for duplicate email in Meteor accounts to prevent account duplication.
      if (Accounts.findUserByEmail(email)) {
        throw new Meteor.Error('email-exists', 'An account with this email already exists.');
      }

      // Check for duplicate profile in the UserProfile collection.
      const duplicateProfile = this.findOne({ email });
      if (duplicateProfile) {
        throw new Meteor.Error('profile-exists', 'A profile with this email already exists.');
      }

      const role = ROLE.USER;
      const userID = Users.define({ username, role, password });
      const profileID = this._collection.insert({ email, firstName, lastName, userID, role, picture, interests });
      return profileID;
    }
    throw new Meteor.Error('not-allowed', 'This operation is not allowed on the client.');
  }

  /**
   * Updates the UserProfile. You cannot change the email or role.
   * @param docID the id of the UserProfile
   * @param firstName new first name (optional).
   * @param lastName new last name (optional).
   */
  update(docID, { firstName, lastName, picture, interests }) {
    if (Meteor.isServer) {
      this.assertDefined(docID);
      const updateData = { ...(firstName && { firstName }), ...(lastName && { lastName }), ...(picture && { picture }), ...(interests && { interests }) };
      this._collection.update(docID, { $set: updateData });
    } else {
      throw new Meteor.Error('not-allowed', 'This operation is not allowed on the client.');
    }
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  removeIt(profileID) {
    if (Meteor.isServer) {
      if (this.isDefined(profileID)) {
        const profile = this.findOne(profileID);
        if (profile && profile.userID) {
          // Directly remove the user from the Meteor.users collection.
          Meteor.users.remove(profile.userID);
        }
        return super.removeIt(profileID); // Assuming this removes the profile from your custom collection.
      }
      return false;
    }
    throw new Meteor.Error('not-allowed', 'This operation is not allowed on the client.');
  }

  /**
   * TODO CAM: Update this documentation since we want to be able to sign up new users.
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod() {
    // this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
    return true;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (doc.role !== ROLE.User) {
        problems.push(`UserProfile instance does not have ROLE.USER: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the UserProfile docID in a format acceptable to define().
   * @param docID The docID of a UserProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const email = doc.email;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const interests = doc.interests;
    return { email, firstName, lastName, picture, interests }; // CAM this is not enough for the define method. We lose the password.
  }

  /**
   * Publishes the first and last name associated with a user's ID.
   * @param {string} userId The ID of the user.
   */
  publishUserName(userId) {
    this._collection._ensureIndex({ userID: 1 }); // Ensure an index for efficient queries
    return this._collection.find({ userID: userId }, { fields: { firstName: 1, lastName: 1 } });
  }
}

/**
 * Profides the singleton instance of this class to all other entities.
 * @type {UserProfileCollection}
 */
export const UserProfiles = new UserProfileCollection();
