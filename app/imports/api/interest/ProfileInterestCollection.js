import SimpleSchema from 'simpl-schema';
import BaseProfileCollection from '../user/BaseProfileCollection';
import { Interests } from './InterestCollection';

class ProfileInterestCollection extends BaseProfileCollection {
  constructor() {
    super('ProfileInterest', new SimpleSchema({
      profileId: String,
      interestId: String,
    }));
  }

  /**
   * Associates an interest with a user profile.
   * @param profileId The ID of the user profile.
   * @param interestId The ID of the interest.
   * @return {String} The document ID of the new association.
   */
  define({ profileId, interestId }) {
    // Ensure the interest exists
    if (!Interests.isDefined(interestId)) {
      throw new Error(`Interest with ID ${interestId} does not exist.`);
    }
    // Create the association
    const docId = this._collection.insert({ profileId, interestId });
    return docId;
  }

  /**
   * Removes an association between a profile and an interest.
   * @param docId The document ID of the association to remove.
   */
  removeIt(docId) {
    super.removeIt(docId);
  }

  // Additional methods (e.g., findByProfileId, findByInterestId) as needed...
}

export const ProfileInterests = new ProfileInterestCollection();
