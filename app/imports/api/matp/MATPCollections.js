import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../stuff/StuffCollection';
import { AdminProfiles } from '../user/AdminProfileCollection';
import { UserProfiles } from '../user/UserProfileCollection';
import { Nonprofits } from '../nonprofit/NonprofitCollection';
import { Events } from '../calendar/EventCollection';
import { Activity } from '../activities/ActivityCollection';
import { Messages } from '../messaging/MessagesCollection';
import { Conversations } from '../messaging/ConversationsCollection';
import { Pending } from '../activities/PendingCollection';
import { Volunteer } from '../activities/VolunteerCollection';
import { Posts } from '../forum/PostsCollection';
import { Comments } from '../forum/CommentsCollection';
import { Organizations } from '../organization/OrganizationCollection';
import { Causes } from '../organization/CauseCollection';

class MATPClass {
  collections;

  collectionLoadSequence;

  collectionAssociation;

  constructor() {
    // list of all the MATPCollections collections
    this.collections = [
      AdminProfiles,
      Events,
      Stuffs,
      UserProfiles,
      Nonprofits,
      Activity,
      Messages,
      Conversations,
      Volunteer,
      Pending,
      Posts,
      Comments,
      Causes,
      Organizations,
    ];
    /*
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     */
    this.collectionLoadSequence = [
      AdminProfiles,
      UserProfiles,
      Events,
      Stuffs,
      Nonprofits,
      Activity,
      Messages,
      Conversations,
      Volunteer,
      Pending,
      Posts,
      Comments,
      Causes,
      Organizations,
    ];

    /*
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    this.collections.forEach((collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });

  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  getCollection(collectionName) {
    // console.log('MATPCollections', collectionName, this.collectionAssociation);
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called MARTPCollections.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

export const MATPCollections = new MATPClass();
