// imports
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Modal } from 'react-bootstrap';
import { Calendars } from '../../../api/calendar/CalendarCollection';
import CalendarEventForm from './CalendarEventForm'; // Assuming it's in the same directory
import { getRandomBackground } from '../../utilities/RandomBackground';

const CalendarEventsList = ({ events, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = (event = null) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div>
      <h2 className="mt-3 mb-4">Calendar Events</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        Add New Event
      </Button>
      <div className="d-flex flex-wrap">
        {events.map((event) => (
          <div className="card m-2" style={{ width: '18rem', backgroundImage: `url(${getRandomBackground()})`, backgroundSize: 'cover' }} key={event._id}>
            <div className="card-body" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}> { /* // Added a slight white overlay for readability */ }
              <h5 className="card-title">{event.title}</h5>
              <p className="card-text">{event.description}</p>
              <Button variant="secondary" onClick={() => handleShow(event)}>
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarEventForm existingEvent={selectedEvent} onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Define prop types
CalendarEventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    // Include other properties as necessary
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('calendar.all'); // Ensure this matches the publication name
  return {
    isLoading: !handle.ready(),
    events: Calendars.find().fetch(),
  };
})(CalendarEventsList);
