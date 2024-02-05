import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';

class StaffCollection extends BaseCollection {
  constructor() {
    super('Staff', new SimpleSchema({
      firstName: String,
      lastName: String,
      position: String,
      organizationId: String,
      calendarId: {
        type: String,
        optional: true,
      },
      createdAt: {
        type: Date,
        defaultValue: new Date(),
      },
    }));
  }

  // Define additional methods for Staff if needed
}

export const Staff = new StaffCollection();
