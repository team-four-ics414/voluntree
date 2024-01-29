import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class EventCollection extends BaseCollection {
  constructor() {
    super('Events', new SimpleSchema({
      title: String,
      description: {
        type: String,
        optional: true,
      },
      startTime: Date,
      endTime: Date,
      location: String,
      calendarId: String,
      createdAt: {
        type: Date,
        defaultValue: new Date(),
      },
      nonprofitId: {
        type: String,
        optional: true,
      },
      activityDetails: {
        type: String,
        optional: true,
      },
      frequency: {
        type: String,
        optional: true,
      },
      commitmentRequired: {
        type: Boolean,
        optional: true,
        defaultValue: false,
      },
      skillsRequired: {
        type: Array,
        optional: true,
      },
      'skillsRequired.$': String,
      accessibilityInfo: {
        type: String,
        optional: true,
      },
      requirements: {
        type: Object,
        optional: true,
      },
      'requirements.backgroundCheck': {
        type: Boolean,
        optional: true,
        defaultValue: false,
      },
      'requirements.ageRange': {
        type: String,
        optional: true,
      },
      impact: {
        type: String,
        optional: true,
      },
      volunteerValueEstimate: {
        type: Number,
        optional: true,
      },
      isOpenForRegistration: {
        type: Boolean,
        defaultValue: true,
      },
      isVirtual: {
        type: Boolean,
        defaultValue: false,
      },
      maxParticipants: {
        type: SimpleSchema.Integer,
        optional: true,
      },
      // Additional fields that might be relevant
      targetAudience: {
        type: String,
        optional: true,
      },
      hostedBy: {
        type: String,
        optional: true,
      },
      // Cloudinary image URL integration here
      eventImageUrl: {
        type: String,
        optional: true,
      },
      tags: {
        type: Array,
        optional: true,
      },
      'tags.$': String,
    }));
  }

  // Additional methods for event management can be added here
}

export const Events = new EventCollection();
