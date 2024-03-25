import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Volunteer } from './VolunteerCollection';
import { ROLE } from '../role/Role';

Meteor.methods({
  'volunteer.insert'(volunteer) {
    console.log('Inserting volunteer:', volunteer);
    check(volunteer, {
      activityName: String,
      participant: Match.Maybe([String]), // Array of strings, can be undefined
      owner: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Volunteer.assertValidRoleForMethod(this.userId);

    return Volunteer.define(volunteer);
  },

  'volunteer.update'(volunteerId, changes) {
    check(volunteerId, String);
    check(changes, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const volunteer = Volunteer.findDoc(volunteerId);

    if (volunteer.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('Not authorized to update this volunteer.');
    }

    Volunteer.assertValidRoleForMethod(this.userId);

    // Prepare the update data
    const updates = { ...changes };

    return Volunteer.update(volunteerId, { $set: updates });
  },

  'volunteer.remove'(volunteerId) {
    check(volunteerId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const volunteer = Volunteer.findDoc(volunteerId);

    if (volunteer.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('Not authorized to remove this volunteer.');
    }

    Volunteer.assertValidRoleForMethod(this.userId);

    return Volunteer.removeIt(volunteerId);
  },

  'volunteer.addToParticipant'(volunteerId, newParticipant) {
    check(volunteerId, String);
    check(newParticipant, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    // Check if the current user has permission to add a participant
    const volunteer = Volunteer.findDoc(volunteerId);
    if (volunteer.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.USER])) {
      throw new Meteor.Error('Not authorized to add participants to this volunteer.');
    }

    return Volunteer.addToParticipant(volunteerId, newParticipant);
  },
});
