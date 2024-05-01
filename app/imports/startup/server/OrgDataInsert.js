import { Meteor } from 'meteor/meteor';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Causes } from '../../api/organization/CauseCollection';

Meteor.startup(() => {
  // Fetching the data from a JSON file stored in private assets
  // eslint-disable-next-line no-undef
  const data = Assets.getText('data.org.json');
  const organizations = JSON.parse(data);

  // Fetching all causes to ensure they are loaded before processing organizations
  const allCauses = Causes.find().fetch();
  console.log('All causes fetched:', allCauses); // This will log all the causes fetched from the database

  // Creating a map of cause names to their respective IDs
  const causesMap = allCauses.reduce((acc, cause) => {
    if (cause._id.match(/^[a-zA-Z0-9]{17,}$/)) { // Adjust regex as needed based on your actual ID format
      acc[cause.name] = cause._id;
    } else {
      console.error(`Invalid ID format for cause ${cause.name}: ${cause._id}`);
    }
    return acc;
  }, {});

  console.log('Causes Map:', causesMap); // This will show the mapping of cause names to IDs

  organizations.forEach(org => {
    const { name, type, missionStatement, description, email, contactEmail, website, phoneNumber, address, member, causes, logo, createdAt } = org;

    // Mapping cause names to their IDs using the causesMap
    const causeIds = causes.map(causeName => causesMap[causeName]).filter(id => id);
    console.log(`Mapped cause IDs for organization '${name}':`, causeIds);

    const organizationData = {
      name,
      type,
      missionStatement,
      description,
      email,
      contactEmail,
      website,
      phoneNumber,
      address,
      member,
      causeIds,
      logo,
      createdAt: new Date(createdAt),
    };

    if (!Organizations.findOne({ email })) {
      try {
        const organizationId = Organizations.define(organizationData);
        console.log(`Inserted organization with ID: ${organizationId} for email: ${email}`);
      } catch (error) {
        console.error(`Error inserting organization '${name}': ${error.message}`);
      }
    } else {
      console.log(`Organization already exists with email: ${email}`);
    }
  });
});
