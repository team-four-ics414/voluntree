import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CalendarModal = ({ show, handleClose, event, handleSave, handleDelete }) => {
  // Initialize form state with event data if present, otherwise with defaults
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    start: new Date(),
    end: new Date(),
  });

  // Update form state when an event is selected for editing
  useEffect(() => {
    if (event) {
      setEventData({
        ...event,
        start: event.start.toISOString().substring(0, 10), // Format date for input[type="date"]
        end: event.end.toISOString().substring(0, 10),
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert date strings back to Date objects before saving
    const submissionData = {
      ...eventData,
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    };

    handleSave(submissionData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{event ? 'Edit Event' : 'Add New Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Event Start Date</Form.Label>
            <Form.Control
              type="date"
              name="start"
              required
              value={eventData.start.substring(0, 10)}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event End Date</Form.Label>
            <Form.Control
              type="date"
              name="end"
              required
              value={eventData.end.substring(0, 10)}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              required
              value={eventData.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={eventData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
          {event && (
            <Button variant="danger" onClick={() => handleDelete(event._id)} className="ms-2">
              Delete Event
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// Define propTypes
CalendarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }),
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

CalendarModal.defaultProps = {
  event: null,
};

export default CalendarModal;
