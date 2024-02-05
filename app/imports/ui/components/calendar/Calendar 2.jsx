import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../../client/calendarstyles.css';
import moment from 'moment';
import { Events } from '../../../api/calendar/EventCollection';

/*
  * This component is a calendar that displays events from the database.
  * It uses the react-big-calendar package to display the events.
  * The events are fetched from the database and formatted to be used by the react-big-calendar package.
  * The events are then displayed on the calendar.
  * The calendar is displayed in the CalendarPage component.
  * The events are fetched from the database using the withTracker function.
  * The events are then passed to the MyCalendar component as a prop.
  * The MyCalendar component then formats the events and displays them on the calendar.
  * https://jquense.github.io/react-big-calendar/examples/?path=/story/about-big-calendar--page
 */

moment.locale('en');
const localizer = momentLocalizer(moment); // Updated way to set localizer

const MyCalendar = ({ events }) => {
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer} // Updated prop usage
        events={formattedEvents}
        defaultDate={new Date()}
        defaultView="month"
      />
    </div>
  );
};

MyCalendar.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    startTime: PropTypes.instanceOf(Date).isRequired,
    endTime: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('events');
  const events = Events.find().fetch();
  return { events };
})(MyCalendar);
