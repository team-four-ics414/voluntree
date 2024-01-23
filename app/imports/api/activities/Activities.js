import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Organizations } from '../organization/Organization';

class ActivitiesCollection {
  constructor() {
    this.name = 'ActivitiesCollection';
    this.collection = new Mongo.Collection(this.name);
    this.schema = new SimpleSchema({
      time: String,
      name: String,
      details: String,
      createdAt: Date,
      benefits: String,
      location: String,
      frequency: String,
      requirement: String,
      contactInfo: String,
      image: { type: String, optional: true },
      owner: String,
    });
    this.collection.attachSchema(this.schema);
    this.userPublicationName = `${this.name}.publication.user`;

    if (Meteor.isServer) {
      Meteor.startup(() => {
        this.collection.rawCollection().createIndex({ owner: 1 }, { unique: true });
      });
    }
    Meteor.methods({
      // eslint-disable-next-line meteor/audit-argument-checks
      'Activities.insert'(activityData) {
        if (!this.userId) {
          throw new Meteor.Error('not-authorized');
        }
        // eslint-disable-next-line no-use-before-define
        Activities.collection.insert(activityData);
      },
    });
  }
}

export const Activities = new ActivitiesCollection();
