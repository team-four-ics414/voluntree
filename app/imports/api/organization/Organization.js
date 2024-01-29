import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

class OrganizationsCollection {
  constructor() {
    this.name = 'OrganizationsCollection';
    this.collection = new Mongo.Collection(this.name);
    this.schema = new SimpleSchema({
      name: String,
      mission: String,
      contactInfo: String,
      location: String,
      createdAt: Date,
      image: { type: String, optional: true },
      owner: String,
    });
    this.collection.attachSchema(this.schema);
    this.userPublicationName = `${this.name}.publication.user`;

    if (Meteor.isServer) {
      Meteor.startup(() => {
        this.collection.rawCollection().createIndex({ owner: 1 }, { unique: true });
      });

      Meteor.methods({
        // eslint-disable-next-line meteor/audit-argument-checks
        'Organizations.insert'(organizationData) {
          if (!this.userId) {
            throw new Meteor.Error('not-authorized');
          }
          // eslint-disable-next-line no-use-before-define
          Organizations.collection.insert(organizationData);
        },
      });
    }
  }
}

export const Organizations = new OrganizationsCollection();
