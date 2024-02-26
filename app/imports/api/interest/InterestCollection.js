import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class InterestCollection extends BaseCollection {
  constructor() {
    super('Interest', new SimpleSchema({
      name: String,
    }));
  }

  /**
   * Defines a new Interest.
   * @param name The name of the interest.
   * @param description A brief description of the interest.
   * @return {String} The document ID of the new interest.
   */
  define({ name = '' }) {
    const docId = this._collection.insert({ name });
    return docId;
  }

  /**
   * Updates the given interest.
   * @param docId The ID of the interest to update.
   * @param name The new name of the interest.
   * @param description The new description of the interest.
   */
  update(docId, { name }) {
    const updateData = {};
    if (name) updateData.name = name;
    this._collection.update(docId, { $set: updateData });
  }

  // Additional methods (e.g., removeIt, findByName) as needed...
}

export const Interests = new InterestCollection();
