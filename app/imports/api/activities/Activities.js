import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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
  }
}

export const Activities = new ActivitiesCollection();
