import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Meteor } from 'meteor/meteor';
import { Button, Form, Alert } from 'react-bootstrap';

const CalendarEventForm = ({ existingEvent, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description || '');
      setStartDate(existingEvent.startDate.toISOString().substring(0, 10));
      setEndDate(existingEvent.endDate.toISOString().substring(0, 10));
      setAllDay(existingEvent.allDay || false);
    }
  }, [existingEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = { title, description, startDate: new Date(startDate), endDate: new Date(endDate), allDay };
    const method = existingEvent ? 'calendar.update' : 'calendar.insert';
    const args = existingEvent ? [existingEvent._id, eventData] : [eventData];

    Meteor.call(method, ...args, (apiError, response) => {
      if (apiError) {
        setError(`Error: ${apiError.message}`);
      } else {
        onSuccess(); // Close modal on success
        alert(existingEvent ? 'Event updated successfully!' : `New event added with ID: ${response}`);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
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
      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Event description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formStartDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formEndDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formAllDay">
        <Form.Check
          type="checkbox"
          label="All Day"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save Event
      </Button>
      {existingEvent && (
        <Button
          variant="danger"
          onClick={() => Meteor.call('calendar.remove', existingEvent._id, (removeError) => { // Renamed `error` to `removeError`
            if (removeError) {
              setError(`Error: ${removeError.message}`);
            } else {
              onSuccess(); // Close modal and refresh list
              alert('Event deleted successfully');
            }
          })}
          className="ms-2"
        >
          Delete Event
        </Button>

      )}
    </Form>
  );
};

// Prop validation
CalendarEventForm.propTypes = {
  existingEvent: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    allDay: PropTypes.bool,
  }),
  onSuccess: PropTypes.func.isRequired,
};

CalendarEventForm.defaultProps = {
  existingEvent: null, // Or an appropriate default object structure
};

export default CalendarEventForm;
