import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const commentsCollection = {
  comments: 'Comments',
};

const CommentsScheme = new SimpleSchema({
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
    defaultValue: null,
    optional: true,
  },
});

class CommentsCollection extends BaseCollection {
  constructor() {
    super('Posts', CommentsScheme);
  }

  define({ contents, owner, creationDate, dateUpdate }) {
    const docID = this._collection.insert({
      contents: contents,
      owner: owner,
      createdAt: creationDate ? new Date(creationDate) : new Date(),
      lastUpdated: dateUpdate ? new Date(dateUpdate) : null,
    });
    return docID;
  }

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
      Meteor.publish(postsPublications.userPosts, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });

      Meteor.publish(postsPublications.posts, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribePosts() {
    if (Meteor.isClient) {
      return Meteor.subscribe(postsPublications.posts);
    }
    return null;
  }

  subscribeUserPosts() {
    if (Meteor.isClient) {
      return Meteor.subscribe(postsPublications.userPosts);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const title = doc.title;
    const contents = doc.contents;
    const owner = doc.owner;
    const createdAt = doc.createdAt;
    const lastUpdated = doc.lastUpdated;
    return { title, contents, owner, createdAt, lastUpdated };
  }
}

export const Comments = new CommentsCollection();
