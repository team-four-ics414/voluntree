import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line no-unused-vars
import { check, Match } from 'meteor/check';
import { Opportunity } from './OpportunityCollection';

Meteor.methods({
  'opportunity.insert'(opportunity) {
    check(opportunity, {
      name: String,
      image: String,
      description: String,
      category: String,
      location: String,
      time: String,
      frequency: String,
    });

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const opportunityId = Opportunity.define(opportunity);
    return opportunityId;
  },

  'opportunity.update'(opportunityId, changes) {
    check(opportunityId, String);
    check(changes, Object);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    return Opportunity.update(opportunityId, changes);
  },

  'opportunity.remove'(opportunityId) {
    check(opportunityId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    return Opportunity.removeIt(opportunityId);
  },
});
