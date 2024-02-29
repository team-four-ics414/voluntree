import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const AddToCalendar = ({ activity }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [error, setError] = useState('');

  // Open modal and pre-populate form
  const openModal = () => {
    setTitle(activity.name);
    setDescription(activity.details);
    setStartDate(activity.startDate); // Ensure startDate is in the correct format
    setEndDate(activity.endDate); // Ensure endDate is in the correct format
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if an event for this activity already exists in the calendar
    Meteor.call('calendar.checkExists', activity._id, (checkError, exists) => {
      if (checkError) {
        setError(`Error checking for existing event: ${checkError.message}`);
        return;
      }

      // If the event already exists, display an error and prevent adding a new one
      if (exists) {
        setError('An event for this activity already exists in the calendar.');
        return; // Stop here to prevent adding a duplicate event
      }

      // If no event exists, proceed to insert a new event
      const eventData = {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        allDay,
        activityId: activity._id,
      };

      Meteor.call('calendar.insert', eventData, (apiError, response) => {
        if (apiError) {
          setError(`Error adding event: ${apiError.message}`);
        } else {
          closeModal(); // Close the modal on successful event addition
          alert(`Event added successfully with ID: ${response}`);
        }
      });
    });
  };

  return (
    <>
      <Button variant="success" onClick={openModal}>Add Calendar</Button>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Title Field */}
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Description Field */}
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* Start Date Field */}
            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>

            {/* End Date Field */}
            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>

            {/* All Day Checkbox */}
            <Form.Group className="mb-3" controlId="formAllDay">
              <Form.Check
                type="checkbox"
                label="All Day Event"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Save Event</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

AddToCalendar.propTypes = {
  activity: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
};

export default AddToCalendar;
