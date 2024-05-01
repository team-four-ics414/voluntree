import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Causes } from './CauseCollection';

// Extend SimpleSchema with custom validation rules if needed
SimpleSchema.extendOptions(['autoform']);

const OrganizationSchema = new SimpleSchema({
  name: {
    type: String,
    max: 200,
  },
  type: {
    type: String,
    allowedValues: ['Nonprofit', 'NGO', 'Community', 'Other'], // Customize as needed
  },
  missionStatement: {
    type: String,
    optional: true, // Consider if this should be optional
    max: 1000, // Define a maximum length as appropriate
  },
  description: {
    type: String,
    optional: true,
    max: 1000,
  },
  email: {
    type: String,
    regEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  contactEmail: {
    type: String,
    regEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  website: {
    type: String,
    optional: true,
    regEx: /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/,
  },
  phoneNumber: {
    type: String,
    regEx: /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/im,
    optional: true,
  },
  address: {
    type: Object,
    optional: true,
  },
  'address.street': {
    type: String,
    max: 200,
  },
  'address.city': {
    type: String,
    max: 100,
  },
  'address.state': {
    type: String,
    max: 100,
  },
  'address.zipCode': {
    type: String,
    regEx: /^[0-9]{5}(?:-[0-9]{4})?$/,
  },
  'address.country': {
    type: String,
    max: 100,
  },
  member: {
    type: Array,
    optional: true,
  },
  'member.$': {
    type: Object,
  },
  'member.$.name': {
    type: String,
    max: 200,
  },
  'member.$.role': {
    type: String,
    allowedValues: ['Member', 'Admin'], // Adjust roles as needed
  },
  'member.$.email': {
    type: String,
    regEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  causeIds: {
    type: Array,
    optional: true,
  },
  'causeIds.$': {
    type: String,
    regEx: /^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17,}$/, // MongoDB default ID format
  },
  logo: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  /* Need to figure out how to handle createdBy

  createdBy: {
    type: String,
    regEx: /^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17}$/,
  },

  */
});

class OrganizationCollection extends BaseCollection {
  constructor() {
    super('Organizations', OrganizationSchema);
  }

  /**
   * Defines a new Organization.
   * @param {Object} organization The organization data according to OrganizationSchema.
   * @returns {String} The ID of the newly created organization.
   */
  define(organization) {
    console.log('Attempting to insert organization with email:', organization.email); // Log the email
    if (Meteor.isServer && !this.userId) {
      // Validate cause IDs first
      organization.causeIds.forEach(causeId => {
        const causeExists = Causes.findOne({ _id: causeId });
        if (!causeExists) {
          console.error(`Cause ID not found: ${causeId}`);
          throw new Meteor.Error('invalid-cause', `Cause ID ${causeId} is invalid or does not exist.`);
        }
      });

      const organizationId = this._collection.insert(organization);
      return organizationId;
    }

    // Existing authorization logic
    if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
      throw new Meteor.Error('unauthorized', "You're not authorized to create organizations.");
    }

    const organizationId = this._collection.insert(organization);
    return organizationId;
  }

  /**
   * Updates an existing organization.
   * @param {String} organizationId The ID of the organization to update.
   * @param {Object} changes The changes to apply, following the schema.
   */
  update(organizationId, changes) {
    super.assertDefined(organizationId);
    // Implement authorization check here

    // Update the organization, with SimpleSchema validating the changes
    this._collection.update(organizationId, { $set: changes });
  }

  /**
   * Removes an organization from the collection.
   * @param {String} organizationId The ID of the organization to remove.
   */
  remove(organizationId) {
    super.assertDefined(organizationId);

    // Implement authorization check here

    this._collection.remove(organizationId);
  }

  // Additional methods for organization-specific logic can be added here
}

if (Meteor.isServer) {
  Meteor.publish('OrganizationsOnly', function publish() {
    if (!this.userId) {
      // Optionally restrict this to logged-in users
      throw new Meteor.Error('unauthorized', 'You must be logged in to view organizations.');
    }
    // eslint-disable-next-line no-use-before-define
    return Organizations._collection.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('OrganizationsOnly');
}

export const Organizations = new OrganizationCollection();
