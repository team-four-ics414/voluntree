import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../../../client/calendarstyles.css';
import PropTypes from 'prop-types'; // Import PropTypes
import { Calendars } from '../../../api/calendar/CalendarCollection';
import CalendarEventForm from './CalendarEventForm'; // Ensure this path is correct

const localizer = momentLocalizer(moment);

const MyCalendar = ({ calendars }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const formattedEvents = calendars.map(event => ({
      title: event.title,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      allDay: event.allDay || false,
      resource: event, // Store the original event object
    }));
    setEvents(formattedEvents);
  }, [calendars]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent} // Handle event selection
        style={{ height: 500 }}
      />

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarEventForm existingEvent={selectedEvent} onSuccess={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Prop validation for MyCalendar
MyCalendar.propTypes = {
  calendars: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    allDay: PropTypes.bool,
  })).isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('calendar.all');
  const calendars = Calendars.find({}).fetch();
  return {
    calendars,
    loading: !subscription.ready(),
  };
})(MyCalendar);
