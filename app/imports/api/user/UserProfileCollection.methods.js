import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Accounts } from 'meteor/accounts-base';
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
  'userProfiles.insert'(profile) {
    check(profile, {
      firstName: String,
      lastName: String,
      email: String,
      picture: String,
      interest: String,
      owner: String,
      userID: String,
      role: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to insert a profile.');
    }

    return UserProfiles._collection.insert(profile);
  },
});

Meteor.methods({
  'users.findByEmail'(email) {
    check(email, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Accounts.findUserByEmail(email.toLowerCase()); // Convert email to lowercase

    if (!user) {
      throw new Meteor.Error('user-not-found', 'No user found with this email address');
    }

    return {
      _id: user._id,
      email: user.emails[0].address,
    };
  },
});
