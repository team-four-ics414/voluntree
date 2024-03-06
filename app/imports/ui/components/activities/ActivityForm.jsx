import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

const ActivityForm = ({ activity, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    details: '',
    createdAt: new Date(), // This should be handled on the server-side ideally
    benefits: '',
    location: { lat: 0, lng: 0 },
    frequency: '',
    requirement: '',
    contactInfo: '',
    image: '',
    owner: '', // This should be set based on the logged-in user's ID ideally
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name,
        time: activity.time,
        details: activity.details,
        createdAt: activity.createdAt,
        benefits: activity.benefits,
        location: activity.location,
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
      setFormData(prevState => ({
        ...prevState,
        owner: Meteor.userId(),
      }));
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location.lat' || name === 'location.lng') {
      setFormData(prevState => ({
        ...prevState,
        location: {
          ...prevState.location,
          [name.split('.')[1]]: parseFloat(value),
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = activity ? 'activity.update' : 'activity.insert';
    const args = activity ? [activity._id, formData] : [formData];

    Meteor.call(method, ...args, (error) => {
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Activity saved successfully');
        onSuccess();
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <Row className="mb-3">
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

        <Form.Group as={Col}>
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="text"
            placeholder="HH:MM / Any description"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Details</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
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
    time: PropTypes.string,
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
  onSuccess: PropTypes.func.isRequired,
};

// Providing default values for props
ActivityForm.defaultProps = {
  activity: null, // Specify a default value (null) for the activity if it's not required
};

export default ActivityForm;
