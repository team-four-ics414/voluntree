import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Modal, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Calendars } from '../../../api/calendar/CalendarCollection';
import CalendarEventForm from './CalendarEventForm'; // Ensure this is adapted to Bootstrap if necessary
import { getRandomBackground } from '../../utilities/RandomBackground';
import { formatDate } from '../../utilities/GetTimeSince';
import CalendarDateOverlay from './CalendarDateOverlay';

const CalendarEventsList = ({ events, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = (event = null) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <h2 className="mt-3 mb-4">Calendar Events</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        Add New Event
      </Button>
      <Row xs={1} md={2} lg={3} className="g-4 mt-3">
        {events.map((event) => (
          <Col key={event._id}>
            <Card className="h-100" style={{ backgroundImage: `url(${getRandomBackground()})`, backgroundSize: 'cover' }}>
              <CalendarDateOverlay date={new Date(event.startDate)} />

              <Card.Img variant="top" src={getRandomBackground()} style={{ opacity: 0 }} />
              <Card.Body style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Button variant="secondary" onClick={() => handleShow(event)}>
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarEventForm existingEvent={selectedEvent} onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

// Define prop types
CalendarEventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('calendar.all');
  return {
    isLoading: !handle.ready(),
    events: Calendars.find().fetch(),
  };
})(CalendarEventsList);
