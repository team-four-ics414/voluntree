import { Meteor } from 'meteor/meteor';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Causes } from '../../api/organization/CauseCollection';

Meteor.startup(() => {
  // eslint-disable-next-line no-undef
  const data = Assets.getText('data.org.json');
  const organizations = JSON.parse(data);

  // Pre-fetch all causes to ensure they are fully loaded before processing organizations
  const causesMap = Causes.find().fetch().reduce((acc, cause) => {
    if (cause._id.match(/^[a-f\d]{24}$/i)) { // Ensure IDs are valid MongoDB ObjectIDs
      acc[cause.name] = cause._id;
    } else {
      console.error(`Invalid ID format for cause ${cause.name}: ${cause._id}`);
    }
    return acc;
  }, {});

  organizations.forEach(org => {
    const { name, type, missionStatement, description, email, contactEmail, website, phoneNumber, address, member, causes, createdAt } = org;
    const causeIds = causes.map(causeName => causesMap[causeName]).filter(id => id);

    const organizationData = { name, type, missionStatement, description, email, contactEmail, website, phoneNumber, address, member, causeIds, createdAt: new Date(createdAt) };

    if (!Organizations.findOne({ email })) {
      try {
        const organizationId = Organizations.define(organizationData);
        console.log(`Inserted organization with ID: ${organizationId}`);
      } catch (error) {
        console.error(`Error inserting organization: ${error.message}`);
      }
    } else {
      console.log(`Organization already exists with email: ${email}`);
    }
  });
});
