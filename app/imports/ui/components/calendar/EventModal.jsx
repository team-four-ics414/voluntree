import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * EventModal component for creating or editing events.
 * @param {Object} props - Component props.
 * @param {boolean} props.show - Whether the modal is shown.
 * @param {Function} props.handleClose - Function to close the modal.
 * @param {Object} props.event - Event object for editing, defaults to an empty object.
 * @param {Function} props.handleSave - Function to save the event.
 */
const EventModal = ({ show, handleClose, event = {}, handleSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    isVirtual: false,
    hostedBy: '',
    maxParticipants: 0,
    isOpenForRegistration: true,
    tags: '',
    category: '', // New field for event category
  });
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // State for user feedback

  useEffect(() => {
    if (show) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: event.startTime ? new Date(event.startTime) : new Date(),
        endTime: event.endTime ? new Date(event.endTime) : new Date(),
        location: event.location || '',
        isVirtual: event.isVirtual || false,
        hostedBy: event.hostedBy || '',
        maxParticipants: event.maxParticipants || 0,
        isOpenForRegistration: event.isOpenForRegistration || true,
        tags: event.tags ? event.tags.join(', ') : '',
        category: event.category || '', // Populate the category
      });
    }
  }, [event, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };

  const validateForm = () => {
    // Simple validation: Ensure required fields are not empty
    if (!formData.title || !formData.description) {
      setFeedback({ message: 'Title and Description are required.', type: 'danger' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Perform validation before proceeding

    const eventData = {
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants, 10),
      tags: formData.tags.split(',').map((tag) => tag.trim()),
    };

    // Simulate API call or saving mechanism
    handleSave(eventData);
    setFeedback({ message: 'Event saved successfully!', type: 'success' });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{event._id ? 'Edit Event' : 'New Event'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}
          <Form.Group controlId="eventTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
            />
          </Form.Group>
          <Form.Group controlId="eventDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
          <Form.Group controlId="eventStartTime">
            <Form.Label>Start Time</Form.Label>
            <DatePicker
              selected={formData.startTime}
              onChange={(date) => handleDateChange('startTime', date)}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="eventEndTime">
            <Form.Label>End Time</Form.Label>
            <DatePicker
              selected={formData.endTime}
              onChange={(date) => handleDateChange('endTime', date)}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </Form.Group>
          {/* Include additional form fields as previously defined */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit">Save Changes</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Prop validation to ensure correct props types are passed.
EventModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    location: PropTypes.string,
    isVirtual: PropTypes.bool,
    hostedBy: PropTypes.string,
    maxParticipants: PropTypes.number,
    isOpenForRegistration: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  handleSave: PropTypes.func.isRequired,
};

/**
 * FormFields - A functional component to render form inputs.
 * This approach helps in keeping the EventModal component cleaner and more focused.
 */
EventModal.defaultProps = {
  event: {}, // Defines default props for `event`
};

// Additional PropTypes validation for FormFields if needed.

export default EventModal;
