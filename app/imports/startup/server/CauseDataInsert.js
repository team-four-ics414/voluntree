import { Meteor } from 'meteor/meteor';
import { Causes } from '../../api/organization/CauseCollection';

Meteor.startup(() => {
  // eslint-disable-next-line no-undef
  const data = Assets.getText('data.cat.json'); // Read the JSON file from the private directory
  const causes = JSON.parse(data); // Parse the JSON data into an array

  causes.forEach(cause => {
    const { name, icon } = cause; // Update these fields according to your Cause schema
    const causeData = {
      name,
      icon,
      createdAt: new Date(), // This field should be automatically set to current date/time if not provided
    };

    // Insert cause if not already present
    if (!Causes.findOne({ name })) {
      const causeId = Causes.define(causeData);
      console.log(`Inserted cause with ID: ${causeId}`);
    } else {
      console.log(`Cause already exists with name: ${name}`);
    }
  });
});
