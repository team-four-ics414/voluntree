import React, { useState, useCallback } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../../client/calendarstyles.css';
import { Events } from '../../../api/calendar/EventCollection';
import EventModal from './EventModal';

// Setup localizer
moment.locale('en');
const localizer = momentLocalizer(moment);

const MyCalendar = ({ events }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Event handlers
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedEvent({ start, end });
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  }, []);

  const handleEventOperation = useCallback((operation, eventData) => {
    const method = operation === 'update' ? 'Events.update' : 'Events.insert';
    const args = operation === 'update' ? [eventData._id, eventData] : [eventData];

    Meteor.call(method, ...args, (error) => {
      if (error) {
        alert(`Error: ${error.reason}`);
      } else {
        handleCloseModal();
      }
    });
  }, [handleCloseModal]);

  const handleSave = useCallback((eventData) => {
    const operation = eventData._id ? 'update' : 'insert';
    handleEventOperation(operation, eventData);
  }, [handleEventOperation]);

  const handleDelete = useCallback((eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      Meteor.call('Events.remove', eventId, (error) => {
        if (!error) {
          handleCloseModal();
        } else {
          alert(`Error: ${error.reason}`);
        }
      });
    }
  }, [handleCloseModal]);

  // Formatting events for the calendar
  const formattedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        defaultDate={new Date()}
        defaultView="month"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
      />
      {isModalVisible && (
        <EventModal
          show={isModalVisible}
          handleClose={handleCloseModal}
          handleSave={handleSave}
          handleDelete={() => selectedEvent && handleDelete(selectedEvent._id)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

MyCalendar.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    startTime: PropTypes.instanceOf(Date).isRequired,
    endTime: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
};

export default withTracker(() => {
  const eventsHandle = Meteor.subscribe('events.all');
  const loading = !eventsHandle.ready();
  const events = !loading ? Events.find().fetch() : [];
  return { events };
})(MyCalendar);
