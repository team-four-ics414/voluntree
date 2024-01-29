import SimpleSchema from 'simpl-schema';
import BaseCollection from '../basecollection/BaseCollection';

class CalendarCollection extends BaseCollection {
  constructor() {
    super('Calendars', new SimpleSchema({
      name: String,
      ownerId: String,
      createdAt: {
        type: Date,
        defaultValue: new Date(),
      },
    }));
  }

  // You can add methods for calendar-specific logic here
}

export const Calendars = new CalendarCollection();
