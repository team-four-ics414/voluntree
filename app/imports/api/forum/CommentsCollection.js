import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const commentsPublications = {
  comments: 'Comments',
};

const CommentsScheme = new SimpleSchema({
  postId: {
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
    defaultValue: null,
    optional: true,
  },
});

class CommentsCollection extends BaseCollection {
  constructor() {
    super('Comments', CommentsScheme);
  }

  define({ postId, contents, owner, creationDate, dateUpdate }) {
    const docID = this._collection.insert({
      postId: postId,
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
      /* Meteor.publish(commentsPublications.comments, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      }); */

      Meteor.publish(commentsPublications.comments, function publish() {
        if (this.userId) {
          return instance._collection.find();
        }
        return this.ready();
      });
    }
  }

  subscribeComments() {
    if (Meteor.isClient) {
      return Meteor.subscribe(commentsPublications.comments);
    }
    return null;
  }

  subscribeUserPosts() {
    if (Meteor.isClient) {
      return Meteor.subscribe(commentsPublications.comments);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const _id = docID;
    const postId = doc.postId;
    const contents = doc.contents;
    const owner = doc.owner;
    const createdAt = doc.createdAt;
    const lastUpdated = doc.lastUpdated;
    return { _id, postId, contents, owner, createdAt, lastUpdated };
  }
}

export const Comments = new CommentsCollection();
