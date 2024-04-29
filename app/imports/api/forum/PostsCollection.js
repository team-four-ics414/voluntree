import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const postsPublications = {
  posts: 'Posts',
  userPosts: 'userPosts', // posts associated with a logged in user.
};

const PostsSchema = new SimpleSchema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  lastUpdated: {
    type: Date,
    optional: true,
  },
  eventId: { // "Foreign key" to the optionally created event.
    type: String,
    optional: true,
  },
});

class PostsCollection extends BaseCollection {
  constructor() {
    super('Posts', PostsSchema);
  }

  /**
   * Defines a new Post.
   * @param title the title of the forum.
   * @param contents contents of the forum.
   * @param owner the owner of the item.
   * @param createdAt date when the post was created.
   * @param lastUpdated date when the post was last updated.
   * @return {String} the docID of the new document.
   */
  define({ _id, title, contents, owner, createdAt, lastUpdated, eventId }) {
    // Convert createdAt and lastUpdated to valid date objects if provided, otherwise use current date
    const createdDate = createdAt ? new Date(createdAt) : new Date();
    const updatedDate = lastUpdated ? new Date(lastUpdated) : createdDate;

    const docID = this._collection.insert({
      _id,
      title,
      contents,
      owner,
      createdAt: createdDate,
      lastUpdated: updatedDate,
      eventId,
    });
    return docID;
  }

  /**
   * Updates the given post.
   * @param docID the id of the document to update.
   * @param title the new title (optional).
   * @param contents the new contents (optional).
   */
  update(docID, { title, contents }) {
    const updateData = {};
    if (title) {
      updateData.title = title;
    }
    if (contents) {
      updateData.contents = contents;
    }
    updateData.lastUpdated = new Date();
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
   * It publishes the entire and user associated collections for any user.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(postsPublications.userPosts, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      /** This subscription publishes all documents regardless of logged in user. */
      Meteor.publish(postsPublications.posts, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for all posts.
   * It subscribes to the entire collection.
   */
  subscribePosts() {
    if (Meteor.isClient) {
      return Meteor.subscribe(postsPublications.posts);
    }
    return null;
  }

  /**
   * Subscription method for posts owned by the current user.
   */
  subscribeUserPosts() {
    if (Meteor.isClient) {
      return Meteor.subscribe(postsPublications.userPosts);
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
   * @return {{owner: *, createdAt: *, lastUpdated: *, contents: *, title: *}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const _id = docID;
    const title = doc.title;
    const contents = doc.contents;
    const owner = doc.owner;
    const createdAt = doc.createdAt;
    const lastUpdated = doc.lastUpdated;
    return { _id, title, contents, owner, createdAt, lastUpdated };
  }
}

export const Posts = new PostsCollection();
