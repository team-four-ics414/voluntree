import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Comments } from './CommentsCollection';
import { ROLE } from '../role/Role';

Meteor.methods({
  'comments.insert'(comment) {
    console.log('Inserting comments:', comment);
    check(comment, {
      _id: String,
      contents: String,
      owner: String,
      createdAt: Date,
      lastUpdated: Match.Optional(Date), // This allows for Date or undefined
    });

    // Ensure the user is logged in before inserting an activity
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Comments.assertValidRoleForMethod(this.userId);

    return Comments.define(comment);
  },

  'comments.update'(commentId, changes) {
    check(commentId, String);
    check(changes, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const comment = Comments.findDoc(commentId);

    if (comment.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
      throw new Meteor.Error('Not authorized to update this post.');
    }

    Comments.assertValidRoleForMethod(this.userId);

    // Create a copy of the changes object to avoid ESLint warning
    const updates = { ...changes };

    return Comments.update(commentId, updates);
  },

  'comment.remove'(commentId) {
    check(commentId, String);

    // Ensure the user is logged in before removing an activity
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const comment = Comments.findDoc(commentId);

    // Optional: Check if the user is the owner or has a specific role
    if (comment.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
      throw new Meteor.Error('Not authorized to remove this post.');
    }

    Comments.assertValidRoleForMethod(this.userId);

    return Comments.removeIt(commentId);
  },
});
