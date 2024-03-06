import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { Events } from '../../api/calendar/EventCollection';
import { Activity } from '../../api/activities/ActivityCollection';
import { Calendars } from '../../api/calendar/CalendarCollection';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Posts } from '../../api/forum/PostsCollection';
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

// Function to add default Forum Posts
function addForumPost(post) {
  console.log(`  Adding Post: ${post.title}`);
  try {
    Posts.define(post);
    console.log(`  Successfully added post: ${post.title}`);
  } catch (error) {
    console.error(`Error adding organization ${post.title}: ${error}`);
  }
}

// Initialize Forum Posts if empty
if (Posts.count() === 0 && Meteor.settings.defaultPosts) {
  console.log('Creating default organizations.');
  Meteor.settings.defaultPosts.forEach(post => addForumPost(post));
}
