import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Activities } from '../../api/activities/Activities';
import { Organizations } from '../../api/organization/Organization';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}

const addActivity = (activity) => {
  console.log(`  Adding: ${activity.name}`);
  Activities.collection.insert(activity);
};

if (Activities.collection.find().count() === 0) {
  if (Meteor.settings.defaultActivities) {
    console.log('Creating default activities.');
    Meteor.settings.defaultActivities.forEach(data => addActivity(data));
  }
}

const addOrganization = (Organization) => {
  console.log(`  Adding: ${Organization.name}`);
  Organizations.collection.insert(Organization);
};

if (Organizations.collection.find().count() === 0) {
  if (Meteor.settings.defaultOrganizations) {
    console.log('Creating default organizations.');
    Meteor.settings.defaultOrganizations.forEach(data => addOrganization(data));
  }
}

// Initialize the database with a default data document.
function addNonprofit(nonprofit) {
  console.log(`  Adding: ${nonprofit.name} (${nonprofit.owner})`);
  Nonprofits.define(nonprofit);
}

// Initialize the NonprofitCollection if empty.
if (Nonprofits.count() === 0) {
  if (Meteor.settings.defaultNonprofits) {
    console.log('Creating default nonprofits.');
    Meteor.settings.defaultNonprofits.forEach(nonprofit => addNonprofit(nonprofit));
  }
}