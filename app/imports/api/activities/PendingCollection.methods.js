import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Pending } from './PendingCollection';
import { ROLE } from '../role/Role';

Meteor.methods({
  'pending.insert'(pendingItem) {
    console.log('Inserting pending item:', pendingItem);
    check(pendingItem, {
      activityID: String,
      activityName: String,
      organizationID: String,
      comment: String,
      owner: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    Pending.assertValidRoleForMethod(this.userId);

    return Pending.define(pendingItem);
  },

  'pending.update'(pendingId, changes) {
    check(pendingId, String);
    check(changes, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const pendingItem = Pending.findDoc(pendingId);

    if (pendingItem.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('Not authorized to update this pending item.');
    }

    Pending.assertValidRoleForMethod(this.userId);

    const updates = { ...changes };

    return Pending.update(pendingId, { $set: updates });
  },

  'pending.remove'(pendingId) {
    check(pendingId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const pendingItem = Pending.findDoc(pendingId);

    if (pendingItem.owner !== this.userId && !Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('Not authorized to remove this pending item.');
    }

    Pending.assertValidRoleForMethod(this.userId);

    return Pending.removeIt(pendingId);
  }
});
