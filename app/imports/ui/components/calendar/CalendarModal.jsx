import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'; // Import PropTypes

const CalendarModal = ({ show, handleClose, handleSave, calendarDetails }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (calendarDetails) {
      setName(calendarDetails.name || '');
      setDescription(calendarDetails.description || '');
    }
  }, [calendarDetails]);

  const onSave = () => {
    handleSave({ name, description });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{calendarDetails ? 'Edit Calendar' : 'New Calendar'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Define prop types
CalendarModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  calendarDetails: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

// Define default props
CalendarModal.defaultProps = {
  calendarDetails: null, // Assume no details are passed for a new calendar
};

export default CalendarModal;
