import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
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
    <Form onSubmit={handleSubmit}>
      {/* Existing Fields */}
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
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          type="number"
          name="location.lat"
          value={formData.location.lat}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Longitude</Form.Label>
        <Form.Control
          type="number"
          name="location.lng"
          value={formData.location.lng}
          onChange={handleChange}
        />
      </Form.Group>
      {/* Add more fields similarly */}
      <Button type="submit">Save Activity</Button>
    </Form>
  );
};

ActivityForm.propTypes = {
  activity: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default ActivityForm;
