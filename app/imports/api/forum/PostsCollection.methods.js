import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Posts } from './PostsCollection';
import { ROLE } from '../role/Role';

Meteor.methods({
  'posts.insert'(post) {
    console.log('Inserting post:', post);
    check(post, {
      title: String,
      contents: String,
      owner: String,
      createdAt: Date,
      lastUpdated: Match.Maybe(Date), // This allows for Date or undefined
      eventId: Match.Maybe(String),
    });

    // Ensure the user is logged in before inserting an activity
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Posts.assertValidRoleForMethod(this.userId);

    return Posts.define(post);
  },

  'posts.update'(postId, changes) {
    check(postId, String);
    check(changes, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const post = Posts.findDoc(postId);

    if (post.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
      throw new Meteor.Error('Not authorized to update this post.');
    }

    Posts.assertValidRoleForMethod(this.userId);

    // Create a copy of the changes object to avoid ESLint warning
    const updates = { ...changes };

    return Posts.update(postId, updates);
  },

  'posts.remove'(postId) {
    check(postId, String);

    // Ensure the user is logged in before removing an activity
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const post = Posts.findDoc(postId);

    // Optional: Check if the user is the owner or has a specific role
    if (post.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
      throw new Meteor.Error('Not authorized to remove this post.');
    }

    Posts.assertValidRoleForMethod(this.userId);

    return Posts.removeIt(postId);
  },
});
