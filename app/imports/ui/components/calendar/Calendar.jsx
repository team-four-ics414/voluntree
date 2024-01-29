// Calendar component
import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types'; // Import PropTypes
import { withTracker } from 'meteor/react-meteor-data';
import BigCalendar from 'react-big-calendar-like-google';
import 'react-big-calendar-like-google/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Events } from '../../../api/calendar/EventCollection';

moment.locale('en');
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const MyCalendar = ({ events }) => {
  // Format events for BigCalendar
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  return (
    <div style={{ height: '700px' }}>
      <BigCalendar
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
    // ... other properties as needed
  })).isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('events');
  const events = Events.find().fetch();
  return { events };
})(MyCalendar);
