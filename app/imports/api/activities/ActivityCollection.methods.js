import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Activity } from './ActivityCollection';
import { ROLE } from '../role/Role';

Meteor.methods({
  'activity.insert'(activity) {
    check(activity, {
      name: String,
      time: String,
      details: String,
      createdAt: Date,
      benefits: String,
      location: {
        lat: Number,
        lng: Number,
      },
      frequency: String,
      requirement: String,
      contactInfo: String,
      image: Match.Maybe(String),
      owner: String,
    });

    // Ensure the user is logged in before inserting an activity
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Activity.assertValidRoleForMethod(this.userId);

    return Activity.define(activity);
  },

  'activity.update'(activityId, changes) {
    check(activityId, String);
    check(changes, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const activity = Activity.findDoc(activityId);

    if (activity.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('Not authorized to update this activity.');
    }

    Activity.assertValidRoleForMethod(this.userId);

    // Create a copy of the changes object to avoid ESLint warning
    const updates = { ...changes };

    // Adjust for nested location updates if necessary
    if (updates.location) {
      updates['location.lat'] = updates.location.lat;
      updates['location.lng'] = updates.location.lng;
      delete updates.location; // Remove the nested location object to avoid schema conflict
    }

    return Activity.update(activityId, updates);
  },

  'activity.remove'(activityId) {
    check(activityId, String);

    // Ensure the user is logged in before removing an activity
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const activity = Activity.findDoc(activityId);

    // Optional: Check if the user is the owner or has a specific role
    if (activity.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('Not authorized to remove this activity.');
    }

    Activity.assertValidRoleForMethod(this.userId);

    return Activity.removeIt(activityId);
  },
});
