import React, { useState } from 'react';
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
const localizer = momentLocalizer(moment);

const MyCalendar = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleSearchInputChange = event => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    // eslint-disable-next-line no-shadow
    const filteredEvents = events.filter(event => event.title.toLowerCase().includes(query));
    setFilteredEvents(filteredEvents);
  };

  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  return (
    <div style={{ display: 'flex', height: '700px' }}>
      <div style={{ flex: '0 0 300px', marginRight: '20px' }}>
        <input
          className="event-search"
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search for events..."
        />
        <div>
          <h3>Matching Events:</h3>
          <ul>
            {filteredEvents.map(event => (
              <li key={event._id}>
                <strong>{moment(event.startTime).format('MMM Do, YYYY')}</strong>: {event.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ flex: '1' }}>
        <Calendar
          localizer={localizer}
          events={formattedEvents}
          defaultDate={new Date()}
          defaultView="month"
        />
      </div>
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
