import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

// Helper function to format Date objects for datetime-local input fields
const formatDateForInput = (date) => {
  if (!date) return '';
  // Adjust date to local timezone to avoid off-by-one errors
  const localDate = new Date(date);
  localDate.setMinutes(date.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDThh:mm'
};

const ActivityForm = ({ activity, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    details: '',
    createdAt: formatDateForInput(new Date()), // Ideally handled server-side
    benefits: '',
    location: { lat: 0, lng: 0 },
    frequency: '',
    requirement: '',
    contactInfo: '',
    image: '',
    owner: '', // Set based on logged-in user's ID
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        startTime: formatDateForInput(activity.startTime),
        endTime: formatDateForInput(activity.endTime),
        details: activity.details,
        createdAt: formatDateForInput(activity.createdAt),
        benefits: activity.benefits,
        location: activity.location || { lat: 0, lng: 0 },
        frequency: activity.frequency,
        requirement: activity.requirement,
        contactInfo: activity.contactInfo,
        image: activity.image,
        owner: activity.owner,
      });
    }
  }, [activity]);

  useEffect(() => {
    if (Meteor.userId()) {
      setFormData((prevState) => ({
        ...prevState,
        owner: Meteor.userId(),
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          [field]: parseFloat(value),
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert string representations of dates back to Date objects
    const adjustedData = {
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: formData.endTime ? new Date(formData.endTime) : undefined, // Ensure this is a Date or not provided
      createdAt: new Date(),
      location: formData.location && formData.location.lat && formData.location.lng
        ? {
          lat: Number(formData.location.lat),
          lng: Number(formData.location.lng),
        }
        : undefined, // Ensure location is properly formatted or excluded if not provided
    };

    // Filter out any fields that are not provided (i.e., are undefined)
    Object.keys(adjustedData).forEach((key) => {
      if (adjustedData[key] === undefined) {
        delete adjustedData[key];
      }
    });

    const method = activity ? 'activity.update' : 'activity.insert';
    const methodArgs = activity ? [activity._id, adjustedData] : [adjustedData];

    Meteor.call(method, ...methodArgs, (error) => {
      if (error) {
        console.error('Error saving activity:', error);
        alert(`Error: ${error.reason || error.message}`);
      } else {
        alert('Activity saved successfully!');
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <Form.Group as={Col}>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter activity name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Row className="mb-3">

        <Form.Group as={Col}>
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>
      <Form.Group>
        <Form.Label>Details</Form.Label>
        <Form.Control
          type="text"
          name="details"
          value={formData.details}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Benefits</Form.Label>
        <Form.Control
          type="text"
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Row className="mb-3">
          <Col>
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="number"
              name="location.lat"
              value={formData.location.lat}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="number"
              name="location.lng"
              value={formData.location.lng}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Form.Group>
      <Form.Group>
        <Form.Label>Frequency</Form.Label>
        <Form.Control
          type="text"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Requirement</Form.Label>
        <Form.Control
          type="text"
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Contact Info</Form.Label>
        <Form.Control
          type="text"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
      </Form.Group>
      {/* Add more fields similarly */}
      <Button type="submit">Save Activity</Button>
    </Form>
  );
};

ActivityForm.propTypes = {
  // Define the shape more specifically for activity
  activity: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
    details: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    benefits: PropTypes.string,
    location: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    frequency: PropTypes.string,
    requirement: PropTypes.string,
    contactInfo: PropTypes.string,
    image: PropTypes.string,
    owner: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
};

// Providing default values for props
ActivityForm.defaultProps = {
  activity: null, // Specify a default value (null) for the activity if it's not required
  onSuccess: () => {}, // Specify a default value (empty function) for onSuccess if it's not required
};

export default ActivityForm;
