import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { Events } from '../../api/calendar/EventCollection';
import { Activity } from '../../api/activities/ActivityCollection';
import { Calendars } from '../../api/calendar/CalendarCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Volunteer } from '../../api/activities/VolunteerCollection';
import { Pending } from '../../api/activities/PendingCollection';
// import { Posts } from '../../api/forum/PostsCollection';

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

function addActivity(activity) {
  console.log(`  Adding: ${activity.name} (${activity.owner})`);
  Activity.define(activity);
}

if (Activity.count() === 0) {
  if (Meteor.settings.defaultActivity) {
    console.log('Creating Default ActivityCollection.');
    Meteor.settings.defaultActivity.forEach(data => addActivity(data));
  }
}

function addPending(pending) {
  console.log(`  Adding: ${pending.owner}`);
  Pending.define(pending);
}

if (Pending.count() === 0) {
  if (Meteor.settings.defaultPending) {
    console.log('Creating Default PendingCollection.');
    Meteor.settings.defaultPending.forEach(data => addPending(data));
  }
}

function addVolunteer(volunteer) {
  console.log(`  Adding: ${volunteer.owner}`);
  Volunteer.define(volunteer);
}

if (Volunteer.count() === 0) {
  if (Meteor.settings.defaultVolunteer) {
    console.log('Creating Default VolunteerCollection.');
    Meteor.settings.defaultVolunteer.forEach(data => addVolunteer(data));
  }
}

const addEvent = (event) => {
  console.log(`  Adding event: ${event.title}`);
  // Handle the addition of event here
  try {
    Events.define(event);
  } catch (error) {
    console.error(`Error adding event ${event.title}: ${error.message}`);
  }
};

// Initialize Events if empty
if (Events.count() === 0 && Meteor.settings.defaultEvents) {
  console.log('Creating default events.');
  Meteor.settings.defaultEvents.forEach(event => addEvent(event));
}

function addCalendarEvent(calendarEvent) {
  console.log(`  Adding calendar event: ${calendarEvent.title}`);
  try {
    Calendars.define(calendarEvent);
  } catch (error) {
    console.error(`Error adding calendar event ${calendarEvent.title}: ${error.message}`);
  }
}

// Initialize CalendarCollection if empty
if (Calendars.count() === 0 && Meteor.settings.defaultCalendarEvents) {
  console.log('Creating default calendar events.');
  Meteor.settings.defaultCalendarEvents.forEach(calendarEvent => addCalendarEvent(calendarEvent));
}

// Function to add default organizations
function addOrganization(organization) {
  console.log(`  Adding organization: ${organization.name}`);
  try {
    Organizations.define(organization);
    console.log(`  Successfully added organization: ${organization.name}`);
  } catch (error) {
    console.error(`Error adding organization ${organization.name}: ${error}`);
  }
}

// Initialize Organizations if empty
if (Organizations.count() === 0 && Meteor.settings.defaultOrganizations) {
  console.log('Creating default organizations.');
  Meteor.settings.defaultOrganizations.forEach(organization => addOrganization(organization));
}
