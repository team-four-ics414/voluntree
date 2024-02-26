import { Meteor } from 'meteor/meteor';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';

/* eslint-disable no-console */

function createUser(email, role, firstName, lastName, password, picture = '', interests = []) {
  console.log(`  Creating user ${email} with role ${role}.`);
  const userProfile = { email, firstName, lastName, password, picture, interests };

  if (role === ROLE.ADMIN) {
    AdminProfiles.define(userProfile);
  } else { // everyone else is just a user.
    UserProfiles.define(userProfile);
  }
}

// When running app for the first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.forEach(({ email, password, role, firstName, lastName, picture, interests }) => createUser(email, role, firstName, lastName, password, picture, interests));
  } else {
    console.log('Cannot initialize the database! Please invoke meteor with a settings file.');
  }
}
