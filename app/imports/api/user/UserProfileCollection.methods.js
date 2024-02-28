import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { UserProfiles } from './UserProfileCollection';

export const signUpNewUserMethod = new ValidatedMethod({
  name: 'UserProfiles.SignupNewUser',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ email, firstName, lastName, password }) {
    if (Meteor.isServer) {
      UserProfiles.define({ email, firstName, lastName, password });
    }
  },
});

Meteor.methods({
  'users.findByEmail'(email) {
    check(email, String);
    // Ensure the method is called by an authenticated user
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Find user by email
    const user = Accounts.findUserByEmail(email);

    if (!user) {
      throw new Meteor.Error('user-not-found', 'No user found with this email address');
    }

    // Return necessary user information (excluding sensitive data)
    return {
      _id: user._id,
      email: user.emails[0].address,
      // Add any other user information you need to return
    };
  },
});
