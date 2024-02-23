import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendars } from '../../../api/calendar/CalendarCollection';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ calendars }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Convert CalendarCollection documents to events
    const formattedEvents = calendars.map(event => ({
      title: event.title,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      allDay: event.allDay || false, // Default to false if allDay isn't specified
      resource: event,
    }));
    setEvents(formattedEvents);
  }, [calendars]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('calendar.all'); // Corrected to match the publication name
  const calendars = Calendars.find({}).fetch();
  return {
    calendars,
    loading: !subscription.ready(),
  };
})(MyCalendar);
