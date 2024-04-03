import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const opportunityPublications = {
  opportunity: 'OpportunityCollection',
};

class OpportunityCollection extends BaseCollection {
  constructor() {
    super('Opportunity', new SimpleSchema({
      name: String,
      image: String,
      description: String,
      category: String,
      location: String,
      time: String,
      frequency: String,
    }));

    // Define default opportunities
    const defaultOpportunities = [
      {
        name: 'Agriculture',
        image: 'images/sample1.jpg',
        // eslint-disable-next-line max-len
        description: 'Get hands-on experience in farming and learn about sustainable agriculture practices. Help plant crops, tend to animals, and maintain the farm environment. Suitable for individuals interested in agriculture or environmental conservation.',
        category: 'Agriculture',
        location: 'Green Valley Farm',
        time: '9:00am - 12:00pm',
        frequency: 'Monthly',
      },
      {
        name: 'Cleanup',
        image: 'images/sample3.jpg',
        description: 'Join us in cleaning up the local parks and streets. Help make our community a cleaner and greener place to live. Gloves and trash bags will be provided. All ages are welcome!',
        category: 'Cleanup',
        location: 'City Park',
        time: '10:00am - 12:00pm',
        frequency: 'Biweekly',
      },
      {
        name: 'Education',
        image: 'images/sample2.jpg',
        description: 'Become a mentor and support students in their educational journey. Help with homework, provide tutoring sessions, or assist in extracurricular activities. Make a positive impact on young minds and empower them to succeed!',
        category: 'Education',
        location: 'Community Library',
        time: '3:00pm - 5:00pm',
        frequency: 'Weekly',
      },
      {
        name: 'Medicine',
        image: 'images/sample4.jpg',
        // eslint-disable-next-line max-len
        description: 'Volunteer with healthcare professionals to provide medical assistance to underserved communities. Assist in health screenings, distribute medication, and offer basic healthcare education. Help improve access to healthcare for all.',
        category: 'Medicine',
        location: 'Free Clinic',
        time: '1:00pm - 4:00pm',
        frequency: 'Monthly',
      },
      {
        name: 'Arts & Culture',
        image: 'images/sample1.jpg',
        description: 'Explore the vibrant world of arts and culture by participating in community art projects and cultural events. Engage in creative activities, learn about different art forms, and promote cultural diversity within the community.',
        category: 'Arts & Culture',
        location: 'Community Center',
        time: '6:00pm - 8:00pm',
        frequency: 'Biweekly',
      },
      {
        name: 'Seniors',
        image: 'images/sample1.jpg',
        description: 'Brighten the day of seniors in nursing homes by spending quality time with them. Engage in conversations, play games, or assist with recreational activities. Bring joy and companionship to elderly individuals in need.',
        category: 'Nursing',
        location: 'Sunshine Nursing Home',
        time: '2:00pm - 4:00pm',
        frequency: 'Weekly',
      },
      {
        name: 'Church',
        image: 'images/sample1.jpg',
        description: 'Support your local church community by volunteering for various church activities and events.',
        category: 'Faith-Based',
        location: 'Grace Community Church',
        time: '9:00am - 12:00pm',
        frequency: 'Monthly',
      },
    ];

    // Check if the collection is empty
    if (this._collection.find().count() === 0) {
      // Insert default opportunities into the collection
      defaultOpportunities.forEach(opportunity => this.define(opportunity));
    }
  }

  define({ name, image, description, category, location, time, frequency }) {
    const docID = this._collection.insert({
      name,
      image,
      description,
      category,
      location,
      time,
      frequency,
    });
    return docID;
  }

  update(docID, { name, image, description, category, location, time, frequency }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (image) {
      updateData.image = image;
    }
    if (description) {
      updateData.description = description;
    }
    if (category) {
      updateData.category = category;
    }
    if (location) {
      updateData.location = location;
    }
    if (time) {
      updateData.time = time;
    }
    if (frequency) {
      updateData.frequency = frequency;
    }
    this._collection.update(docID, { $set: updateData });
  }

  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(opportunityPublications.opportunity, function publish() {
        return instance._collection.find();
      });
    }
  }

  subscribeOpportunity() {
    if (Meteor.isClient) {
      return Meteor.subscribe(opportunityPublications.opportunity);
    }
    return null;
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const image = doc.image;
    const description = doc.description;
    const category = doc.category;
    const location = doc.location;
    const time = doc.time;
    const frequency = doc.frequency;
    return { name, image, description, category, location, time, frequency };
  }

}

export const Opportunity = new OpportunityCollection();
